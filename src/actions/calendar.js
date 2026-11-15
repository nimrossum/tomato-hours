export const CALENDAR_LOADING = "CALENDAR_LOADING"
export const CALENDAR_LOADED = "CALENDAR_LOADED"
export const CALENDAR_ERROR = "CALENDAR_ERROR"
export const CALENDAR_SIGNED_IN = "CALENDAR_SIGNED_IN"
export const SET_CALENDAR_WEEK = "SET_CALENDAR_WEEK"
export const SET_SELECTED_CALENDARS = "SET_SELECTED_CALENDARS"
export const CALENDAR_EVENT_SAVED = "CALENDAR_EVENT_SAVED"
export const CALENDAR_EVENT_DELETED = "CALENDAR_EVENT_DELETED"

export const calendarLoading = () => ({ type: CALENDAR_LOADING })
export const calendarLoaded = ({ calendars, events }) => ({
  type: CALENDAR_LOADED,
  payload: { calendars, events },
})
export const calendarError = (message) => ({
  type: CALENDAR_ERROR,
  payload: { message },
})
export const calendarSignedIn = (accessToken) => ({
  type: CALENDAR_SIGNED_IN,
  payload: { accessToken },
})
export const setCalendarWeek = (week) => ({
  type: SET_CALENDAR_WEEK,
  payload: { week },
})
export const setSelectedCalendars = (calendarIds) => ({
  type: SET_SELECTED_CALENDARS,
  payload: { calendarIds },
})
export const calendarEventSaved = (event) => ({
  type: CALENDAR_EVENT_SAVED,
  payload: { event },
})
export const calendarEventDeleted = (eventId) => ({
  type: CALENDAR_EVENT_DELETED,
  payload: { eventId },
})
