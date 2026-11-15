import reducer, { defaultCalendar } from "./calendar"
import {
  CALENDAR_EVENT_DELETED,
  CALENDAR_EVENT_SAVED,
  CALENDAR_LOADED,
} from "../actions/calendar"

describe("calendar reducer", () => {
  it("selects all calendars on first load", () => {
    const state = reducer(defaultCalendar, {
      type: CALENDAR_LOADED,
      payload: {
        calendars: [{ id: "work" }, { id: "personal" }],
        events: [],
      },
    })

    expect(state.selectedCalendarIds).toEqual(["work", "personal"])
    expect(state.loading).toBe(false)
  })

  it("upserts and removes Google events", () => {
    const event = { id: "event-1", title: "Focus" }
    const saved = reducer(defaultCalendar, {
      type: CALENDAR_EVENT_SAVED,
      payload: { event },
    })

    expect(saved.events).toEqual([event])
    expect(
      reducer(saved, {
        type: CALENDAR_EVENT_DELETED,
        payload: { eventId: "event-1" },
      }).events
    ).toEqual([])
  })
})
