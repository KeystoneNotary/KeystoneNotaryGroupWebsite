export const timeSlotsFallback = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

export const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const formatApiSlots = (slots: string[]) =>
  slots.map((slot) => {
    const [hour, min] = slot.split(":");
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${min} ${ampm}`;
  });

export const convertTo24Hour = (time12h: string): string => {
  const [time, modifier] = time12h.split(" ");
  const [hours, minutes] = time.split(":");
  let hoursNum = hours;
  if (hoursNum === "12") {
    hoursNum = modifier === "AM" ? "00" : "12";
  } else {
    hoursNum =
      modifier === "PM" ? String(parseInt(hoursNum, 10) + 12) : hoursNum;
  }
  return `${hoursNum.padStart(2, "0")}:${minutes}`;
};
