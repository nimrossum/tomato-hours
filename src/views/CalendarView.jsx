import React, { useEffect, useMemo, useState } from "react"
import { connect } from "react-redux"
import moment from "moment"
import Button from "@material-ui/core/Button"
import Checkbox from "@material-ui/core/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import IconButton from "@material-ui/core/IconButton"
import MenuItem from "@material-ui/core/MenuItem"
import Select from "@material-ui/core/Select"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"
import RefreshIcon from "@material-ui/icons/Refresh"
import AddIcon from "@material-ui/icons/Add"
import EventIcon from "@material-ui/icons/Event"
import WarningIcon from "@material-ui/icons/Warning"
import {
  calendarError,
  calendarEventDeleted,
  calendarEventSaved,
  calendarLoaded,
  calendarLoading,
  calendarSignedIn,
  setCalendarWeek,
  setSelectedCalendars,
} from "../actions"
import {
  createEvent,
  deleteEvent,
  listCalendars,
  listEvents,
  requestAccessToken,
  updateEvent,
} from "../helpers/google-calendar"
import {
  getEventMinutes,
  getWeekDays,
} from "../helpers/calendar-week"

const initialForm = {
  title: "",
  calendarId: "",
  start: "",
  end: "",
}

const toInputValue = (value) => moment(value).format("YYYY-MM-DDTHH:mm")

const CalendarView = ({
  calendar,
  dispatch,
}) => {
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [notice, setNotice] = useState(null)
  const days = useMemo(() => getWeekDays(calendar.week), [calendar.week])

  const refresh = async (accessToken = calendar.accessToken) => {
    if (!accessToken) return
    dispatch(calendarLoading())
    try {
      const calendars = await listCalendars(accessToken)
      const events = await listEvents(accessToken, calendars, calendar.week)
      dispatch(calendarLoaded({ calendars, events }))
    } catch (error) {
      dispatch(calendarError(error.message))
    }
  }

  useEffect(() => {
    if (calendar.accessToken) refresh()
  }, [calendar.week, calendar.accessToken])

  const signIn = async () => {
    setNotice(null)
    try {
      const accessToken = await requestAccessToken()
      dispatch(calendarSignedIn(accessToken))
      await refresh(accessToken)
    } catch (error) {
      setNotice(error.message)
    }
  }

  const openNewBlock = (day) => {
    const start = day.clone().hour(9).minute(0)
    setEditingId(null)
    setForm({
      title: "",
      calendarId:
        calendar.calendars.find(
          ({ accessRole }) => accessRole === "owner" || accessRole === "writer"
        )?.id || "",
      start: toInputValue(start),
      end: toInputValue(start.clone().add(1, "hour")),
    })
  }

  const editEvent = (event) => {
    setEditingId(event.id)
    setForm({
      title: event.title,
      calendarId: event.calendarId,
      start: toInputValue(event.start),
      end: toInputValue(event.end),
    })
  }

  const save = async (event) => {
    event.preventDefault()
    setNotice(null)
    if (!form.calendarId || !form.start || !form.end) {
      setNotice("Choose a calendar, start time, and end time.")
      return
    }
    if (new Date(form.end) <= new Date(form.start)) {
      setNotice("End time must be after start time.")
      return
    }
    try {
      const saved = editingId
        ? await updateEvent(
            calendar.accessToken,
            form.calendarId,
            editingId,
            form
          )
        : await createEvent(calendar.accessToken, form.calendarId, form)
      const sourceCalendar = calendar.calendars.find(
        ({ id }) => id === form.calendarId
      )
      dispatch(
        calendarEventSaved({
          id: saved.id,
          calendarId: sourceCalendar.id,
          calendarName: sourceCalendar.summary,
          calendarColor: sourceCalendar.backgroundColor,
          title: saved.summary,
          start: saved.start.dateTime || saved.start.date,
          end: saved.end.dateTime || saved.end.date,
          allDay: !saved.start.dateTime,
          writable: true,
          raw: saved,
        })
      )
      setForm(initialForm)
      setEditingId(null)
      setNotice("Saved to Google Calendar.")
    } catch (error) {
      setNotice(error.message)
    }
  }

  const remove = async () => {
    const event = calendar.events.find(({ id }) => id === editingId)
    if (!event) return
    try {
      await deleteEvent(calendar.accessToken, event.calendarId, event.id)
      dispatch(calendarEventDeleted(event.id))
      setForm(initialForm)
      setEditingId(null)
      setNotice("Removed from Google Calendar.")
    } catch (error) {
      setNotice(error.message)
    }
  }

  const visibleEvents = calendar.events.filter(({ calendarId }) =>
    calendar.selectedCalendarIds.includes(calendarId)
  )
  const plannedMinutes = visibleEvents.reduce(
    (total, event) => total + getEventMinutes(event),
    0
  )
  const writableCalendars = calendar.calendars.filter(
    ({ accessRole }) => accessRole === "owner" || accessRole === "writer"
  )

  if (!calendar.accessToken) {
    return (
      <main className="calendar-view">
        <section className="calendar-intro">
          <EventIcon className="calendar-intro-icon" />
          <Typography variant="h5" component="h1">
            Plan your work week
          </Typography>
          <Typography color="textSecondary">
            Connect Google Calendar to see existing commitments and add focused
            work blocks without creating a second schedule.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={signIn}
            className="calendar-primary-action">
            Connect Google Calendar
          </Button>
          {(calendar.error || notice) && (
            <p className="calendar-error" role="alert">
              <WarningIcon fontSize="small" /> {calendar.error || notice}
            </p>
          )}
        </section>
      </main>
    )
  }

  return (
    <main className="calendar-view">
      <header className="calendar-header">
        <div>
          <Typography variant="h5" component="h1">
            Work week
          </Typography>
          <Typography color="textSecondary">
            {moment(calendar.week).format("MMM D")} to{" "}
            {moment(calendar.week).add(6, "days").format("MMM D, YYYY")}
          </Typography>
        </div>
        <div className="calendar-header-actions">
          <IconButton
            aria-label="Previous week"
            onClick={() =>
              dispatch(
                setCalendarWeek(
                  moment(calendar.week).subtract(7, "days").format("YYYY-MM-DD")
                )
              )
            }>
            <ChevronLeftIcon />
          </IconButton>
          <Button
            onClick={() =>
              dispatch(setCalendarWeek(moment().startOf("isoWeek").format("YYYY-MM-DD")))
            }>
            Today
          </Button>
          <IconButton
            aria-label="Next week"
            onClick={() =>
              dispatch(
                setCalendarWeek(
                  moment(calendar.week).add(7, "days").format("YYYY-MM-DD")
                )
              )
            }>
            <ChevronRightIcon />
          </IconButton>
          <IconButton aria-label="Refresh calendar" onClick={() => refresh()}>
            <RefreshIcon />
          </IconButton>
        </div>
      </header>

      <section className="calendar-summary" aria-label="Weekly summary">
        <strong>{Math.floor(plannedMinutes / 60)}h {plannedMinutes % 60}m</strong>
        <span>scheduled across visible calendars</span>
      </section>

      <section className="calendar-filters" aria-label="Calendar filters">
        {calendar.calendars.map((item) => (
          <FormControlLabel
            key={item.id}
            control={
              <Checkbox
                checked={calendar.selectedCalendarIds.includes(item.id)}
                onChange={(event) =>
                  dispatch(
                    setSelectedCalendars(
                      event.target.checked
                        ? [...calendar.selectedCalendarIds, item.id]
                        : calendar.selectedCalendarIds.filter(
                            (id) => id !== item.id
                          )
                    )
                  )
                }
                style={{ color: item.backgroundColor }}
              />
            }
            label={item.summary}
          />
        ))}
      </section>

      {calendar.loading && (
        <p className="calendar-state" role="status">
          Loading events from Google Calendar...
        </p>
      )}
      {calendar.error && (
        <p className="calendar-error" role="alert">
          <WarningIcon fontSize="small" /> {calendar.error}
        </p>
      )}
      {!calendar.loading && visibleEvents.length === 0 && (
        <p className="calendar-state">
          No events in the visible calendars this week. Add a work block to
          start planning.
        </p>
      )}

      <section className="calendar-week" aria-label="Calendar week">
        {days.map((day) => {
          const events = visibleEvents.filter((event) =>
            moment(event.start).isSame(day, "day")
          )
          return (
            <article className="calendar-day" key={day.format("YYYY-MM-DD")}>
              <header>
                <span>{day.format("ddd")}</span>
                <strong>{day.format("D")}</strong>
              </header>
              <div className="calendar-day-events">
                {events.map((event) => (
                  <button
                    className="calendar-event"
                    key={`${event.calendarId}-${event.id}`}
                    style={{ borderColor: event.calendarColor }}
                    onClick={() => event.writable && editEvent(event)}
                    disabled={!event.writable}
                    title={event.writable ? "Edit event" : "Read-only event"}>
                    <strong>{event.title}</strong>
                    <span>
                      {event.allDay
                        ? "All day"
                        : `${moment(event.start).format("HH:mm")} to ${moment(
                            event.end
                          ).format("HH:mm")}`}
                    </span>
                  </button>
                ))}
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => openNewBlock(day)}>
                  Add block
                </Button>
              </div>
            </article>
          )
        })}
      </section>

      {(form.start || editingId) && (
        <form className="calendar-editor" onSubmit={save}>
          <Typography variant="h6">
            {editingId ? "Edit work block" : "New work block"}
          </Typography>
          <TextField
            label="Title"
            value={form.title}
            onChange={({ target }) => setForm({ ...form, title: target.value })}
            fullWidth
            autoFocus
          />
          <Select
            value={form.calendarId}
            onChange={({ target }) =>
              setForm({ ...form, calendarId: target.value })
            }
            displayEmpty
            fullWidth>
            <MenuItem value="" disabled>
              Choose a writable calendar
            </MenuItem>
            {writableCalendars.map((item) => (
              <MenuItem value={item.id} key={item.id}>
                {item.summary}
              </MenuItem>
            ))}
          </Select>
          <div className="calendar-editor-times">
            <TextField
              label="Starts"
              type="datetime-local"
              value={form.start}
              onChange={({ target }) => setForm({ ...form, start: target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Ends"
              type="datetime-local"
              value={form.end}
              onChange={({ target }) => setForm({ ...form, end: target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </div>
          <div className="calendar-editor-actions">
            <Button type="submit" variant="contained" color="primary">
              Save to Google Calendar
            </Button>
            {editingId && (
              <Button type="button" onClick={remove} color="secondary">
                Delete
              </Button>
            )}
            <Button
              type="button"
              onClick={() => {
                setForm(initialForm)
                setEditingId(null)
              }}>
              Cancel
            </Button>
          </div>
          {notice && <p role="status">{notice}</p>}
        </form>
      )}
    </main>
  )
}

const mapStateToProps = ({ calendar }) => ({ calendar })

export default connect(mapStateToProps)(CalendarView)
