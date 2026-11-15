import moment from "moment"

export const getWeekDays = (week) =>
  Array.from({ length: 7 }, (_, index) =>
    moment(week).add(index, "days")
  )

export const getWeekRange = (week) => ({
  timeMin: moment(week).startOf("day").toISOString(),
  timeMax: moment(week).add(7, "days").startOf("day").toISOString(),
})

export const formatEvent = (event, calendar) => ({
  id: event.id,
  calendarId: calendar.id,
  calendarName: calendar.summary,
  calendarColor: calendar.backgroundColor,
  title: event.summary || "Untitled event",
  start: event.start.dateTime || event.start.date,
  end: event.end.dateTime || event.end.date,
  allDay: !event.start.dateTime,
  writable: calendar.accessRole === "owner" || calendar.accessRole === "writer",
  raw: event,
})

export const getEventMinutes = ({ start, end, allDay }) => {
  if (allDay) return 0
  return Math.max(0, moment(end).diff(moment(start), "minutes"))
}
