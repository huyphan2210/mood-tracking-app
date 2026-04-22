export const formatToday = () => {
  const date = new Date();

  const day = date.getDate();

  const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${weekday}, ${month} ${day}${getOrdinal(day)}, ${year}`;
};

export const formatDateToMonthAndYear = (date: Date) => {
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${month} | ${year}`;
};

export const MONTHS_RECORDS: Record<number, string> = {
  0: "January",
  1: "Febuary",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "Setemper",
  9: "October",
  10: "November",
  11: "December",
};

export const MONTH_OPTIONS = Object.keys(MONTHS_RECORDS).map((key) => ({
  label: MONTHS_RECORDS[parseInt(key)],
  value: parseInt(key),
}));

export const YEAR_OPTIONS = [
  2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037,
];
