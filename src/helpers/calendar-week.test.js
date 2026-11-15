import moment from "moment"
import {
  getEventMinutes,
  getWeekDays,
  getWeekRange,
} from "./calendar-week"

describe("calendar week helpers", () => {
  it("returns seven days starting on the requested Monday", () => {
    const days = getWeekDays("2026-11-16")

    expect(days).toHaveLength(7)
    expect(days[0].format("YYYY-MM-DD")).toBe("2026-11-16")
    expect(days[6].format("YYYY-MM-DD")).toBe("2026-11-22")
  })

  it("creates an exclusive seven-day range", () => {
    expect(getWeekRange("2026-11-16")).toEqual({
      timeMin: moment("2026-11-16").startOf("day").toISOString(),
      timeMax: moment("2026-11-23").startOf("day").toISOString(),
    })
  })

  it("calculates timed event minutes and ignores all-day events", () => {
    expect(
      getEventMinutes({
        start: "2026-11-16T09:00:00Z",
        end: "2026-11-16T10:30:00Z",
        allDay: false,
      })
    ).toBe(90)
    expect(
      getEventMinutes({
        start: "2026-11-16",
        end: "2026-11-17",
        allDay: true,
      })
    ).toBe(0)
  })
})
