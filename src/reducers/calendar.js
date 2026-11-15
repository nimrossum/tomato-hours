import moment from "moment"
import {
  CALENDAR_LOADING,
  CALENDAR_LOADED,
  CALENDAR_ERROR,
  CALENDAR_SIGNED_IN,
  SET_CALENDAR_WEEK,
  SET_SELECTED_CALENDARS,
  CALENDAR_EVENT_SAVED,
  CALENDAR_EVENT_DELETED,
} from "../actions/calendar"

const startOfWeek = () =>
  moment().startOf("isoWeek").format("YYYY-MM-DD")

export const defaultCalendar = {
  accessToken: null,
  calendars: [],
  events: [],
  selectedCalendarIds: [],
  week: startOfWeek(),
  loading: false,
  error: null,
}

export default (state = defaultCalendar, { type, payload }) => {
  switch (type) {
    case CALENDAR_SIGNED_IN:
      return { ...state, accessToken: payload.accessToken, error: null }
    case CALENDAR_LOADING:
      return { ...state, loading: true, error: null }
    case CALENDAR_LOADED:
      return {
        ...state,
        loading: false,
        error: null,
        calendars: payload.calendars,
        events: payload.events,
        selectedCalendarIds:
          state.selectedCalendarIds.length > 0
            ? state.selectedCalendarIds
            : payload.calendars.map(({ id }) => id),
      }
    case CALENDAR_ERROR:
      return { ...state, loading: false, error: payload.message }
    case SET_CALENDAR_WEEK:
      return { ...state, week: payload.week }
    case SET_SELECTED_CALENDARS:
      return { ...state, selectedCalendarIds: payload.calendarIds }
    case CALENDAR_EVENT_SAVED:
      return {
        ...state,
        events: [
          ...state.events.filter(({ id }) => id !== payload.event.id),
          payload.event,
        ],
      }
    case CALENDAR_EVENT_DELETED:
      return {
        ...state,
        events: state.events.filter(({ id }) => id !== payload.eventId),
      }
    default:
      return state
  }
}
