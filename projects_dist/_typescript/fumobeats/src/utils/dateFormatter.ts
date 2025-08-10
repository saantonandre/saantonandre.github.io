// import { startOfWeek, endOfWeek } from "date-fns";

const defaultOptions: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
};

export const formatAwsDate = (
  date: string | null | undefined,
  locale = "en-GB",
  options = defaultOptions
) => {
  return new Date(date || "")
    .toLocaleDateString(locale, options)
    .replaceAll("/", "‑");
};

export const readableDateTime = (date: string) => {
  const pad = (n: number, s = 2) => `${new Array(s).fill(0)}${n}`.slice(-s);
  const d = new Date(date);

  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${pad(
    d.getFullYear(),
    4
  )} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const units: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
  { unit: "year", ms: 31536000000 },
  { unit: "month", ms: 2628000000 },
  { unit: "day", ms: 86400000 },
  { unit: "hour", ms: 3600000 },
  { unit: "minute", ms: 60000 },
  { unit: "second", ms: 1000 },
];
const rtf = new Intl.RelativeTimeFormat("it", { numeric: "auto" });

/**
 * Get language-sensitive relative time message from Dates.
 * @param relative  - the relative dateTime, generally is in the past or future
 * @param pivot     - the dateTime of reference, generally is the current time
 */
export function relativeTimeFromDates(
  relative: Date | null,
  pivot: Date = new Date()
): string {
  if (!relative) return "";
  const elapsed = relative.getTime() - pivot.getTime();
  return relativeTimeFromElapsed(elapsed);
}
export function toHumanReadable(date: Date) {
  const formatted = new Intl.DateTimeFormat("it-IT", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);
  return `${formatted[0].toLocaleUpperCase() + formatted.slice(1)}`;
}

/** Returns seconds as minutes */
export function formatSeconds(seconds: number, truncate?: boolean) {
  if (truncate) {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toFixed(0).padStart(2,"0")}`;
  }
  return `${Math.floor(seconds / 60)}:${(seconds % 60)
    .toFixed(3)
    .padStart(6, "0")}`;
}
/**
 * Get language-sensitive relative time message from elapsed time.
 * @param elapsed   - the elapsed time in milliseconds
 */
export function relativeTimeFromElapsed(elapsed: number): string {
  for (const { unit, ms } of units) {
    if (Math.abs(elapsed) >= ms || unit === "second") {
      return rtf.format(Math.round(elapsed / ms), unit);
    }
  }
  return "";
}

// Returns the first and last day of the week
// export const getWeekBounds = (date: Date) => {
//   return {
//     from: startOfWeek(date, { weekStartsOn: 1 }),
//     to: endOfWeek(date, { weekStartsOn: 1 }),
//   };
// };
