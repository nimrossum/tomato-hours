import { formatEvent, getWeekRange } from "./calendar-week"

const API_ROOT = "https://www.googleapis.com/calendar/v3"
const SCOPE = "https://www.googleapis.com/auth/calendar"

const request = (accessToken, path, options = {}) =>
  fetch(`${API_ROOT}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  }).then(async (response) => {
    const body = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(body.error?.message || "Google Calendar request failed")
    }
    return body
  })

export const loadGoogleIdentityScript = () =>
  new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve()
      return
    }
    const existing = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    )
    if (existing) {
      existing.addEventListener("load", resolve)
      existing.addEventListener("error", reject)
      return
    }
    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })

export const requestAccessToken = async () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
  if (!clientId) {
    throw new Error(
      "Google Calendar is not configured. Set REACT_APP_GOOGLE_CLIENT_ID."
    )
  }
  await loadGoogleIdentityScript()
  return new Promise((resolve, reject) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPE,
      callback: (response) => {
        if (response.error) reject(new Error(response.error))
        else resolve(response.access_token)
      },
    })
    client.requestAccessToken()
  })
}

export const listCalendars = (accessToken) =>
  request(accessToken, "/users/me/calendarList?minAccessRole=reader").then(
    ({ items = [] }) => items
  )

export const listEvents = async (accessToken, calendars, week) => {
  const { timeMin, timeMax } = getWeekRange(week)
  const selected = calendars.filter(
    ({ accessRole }) => accessRole === "owner" || accessRole === "writer" || accessRole === "reader"
  )
  const results = await Promise.all(
    selected.map(async (calendar) => {
      const params = new URLSearchParams({
        timeMin,
        timeMax,
        singleEvents: "true",
        orderBy: "startTime",
        showDeleted: "false",
      })
      const { items = [] } = await request(
        accessToken,
        `/calendars/${encodeURIComponent(calendar.id)}/events?${params}`
      )
      return items.map((event) => formatEvent(event, calendar))
    })
  )
  return results.flat()
}

export const createEvent = (accessToken, calendarId, { title, start, end }) =>
  request(accessToken, `/calendars/${encodeURIComponent(calendarId)}/events`, {
    method: "POST",
    body: JSON.stringify({
      summary: title.trim() || "Work block",
      start: { dateTime: new Date(start).toISOString() },
      end: { dateTime: new Date(end).toISOString() },
      extendedProperties: { private: { tomatoHours: "work-block" } },
    }),
  })

export const updateEvent = (
  accessToken,
  calendarId,
  eventId,
  { title, start, end }
) =>
  request(
    accessToken,
    `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        summary: title.trim() || "Work block",
        start: { dateTime: new Date(start).toISOString() },
        end: { dateTime: new Date(end).toISOString() },
      }),
    }
  )

export const deleteEvent = (accessToken, calendarId, eventId) =>
  request(
    accessToken,
    `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
    { method: "DELETE" }
  )
