import { getAvailableSlots } from "../google-calendar";

const listMock = jest.fn();

jest.mock("googleapis", () => ({
  google: {
    auth: {
      GoogleAuth: jest.fn().mockImplementation(() => ({})),
    },
    calendar: jest.fn(() => ({
      events: {
        list: listMock,
      },
    })),
  },
}));

describe("getAvailableSlots", () => {
  beforeEach(() => {
    listMock.mockReset();
  });

  it("excludes slots that overlap timezone-offset events", async () => {
    listMock.mockResolvedValue({
      data: {
        items: [
          {
            start: { dateTime: "2024-05-10T09:30:00-05:00" },
            end: { dateTime: "2024-05-10T10:30:00-05:00" },
          },
        ],
      },
    });

    const slots = await getAvailableSlots("2024-05-10");

    expect(slots).not.toContain("09:00");
    expect(slots).not.toContain("10:00");
    expect(slots).toContain("11:00");
  });

  it("excludes all slots for date-only events", async () => {
    listMock.mockResolvedValue({
      data: {
        items: [
          {
            start: { date: "2024-05-10" },
            end: { date: "2024-05-11" },
          },
        ],
      },
    });

    const slots = await getAvailableSlots("2024-05-10");

    expect(slots).toEqual([]);
  it("excludes all slots for multi-day date-only events", async () => {
    listMock.mockResolvedValue({
      data: {
        items: [
          {
            start: { date: "2024-05-10" },
            end: { date: "2024-05-12" },
          },
        ],
      },
    });

    const slots = await getAvailableSlots("2024-05-10");
    expect(slots).toEqual([]);
    
    const slotsDay2 = await getAvailableSlots("2024-05-11");
    expect(slotsDay2).toEqual([]);
  });
  it("handles invalid event dates gracefully", async () => {
    listMock.mockResolvedValue({
      data: {
        items: [
          {
            start: { dateTime: "invalid-date" },
            end: { dateTime: "2024-05-10T10:30:00-05:00" },
          },
          {
            start: { dateTime: "2024-05-10T14:00:00-05:00" },
            end: { dateTime: "2024-05-10T15:00:00-05:00" },
          },
        ],
      },
    });

    const slots = await getAvailableSlots("2024-05-10");
    
    // Should still exclude valid event but ignore invalid one
    expect(slots).not.toContain("14:00");
    expect(slots).toContain("09:00"); // Should be available since invalid event is ignored
  });
