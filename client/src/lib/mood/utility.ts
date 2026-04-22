import { MoodResponse } from "../api/data-contracts";

const toDateOnly = (d: Date) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const fillMissingDates = (
  data: MoodResponse[],
  startDate: Date,
  endDate: Date,
): MoodResponse[] => {
  const result: MoodResponse[] = [];

  const start = toDateOnly(startDate);
  const end = toDateOnly(endDate);

  const map = new Map<string, MoodResponse>();
  data.forEach((mood) => {
    const key = toDateOnly(new Date(mood.date!)).toISOString();
    map.set(key, mood);
  });

  const current = new Date(start);

  while (current <= end) {
    const key = current.toISOString();

    if (map.has(key)) {
      result.unshift(map.get(key)!);
    } else {
      result.unshift({
        date: new Date(current).toISOString(),
      });
    }

    current.setDate(current.getDate() + 1);
  }

  return result;
};

export const averageIfAllDefined = <T>(
  items: T[],
  getValue: (item: T) => number | undefined,
): number | undefined => {
  let total = 0;

  for (const item of items) {
    const value = getValue(item);
    if (value === undefined) return undefined;
    total += value;
  }

  return Math.round(total / items.length);
};
