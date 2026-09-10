import { addDays, addWeeks, isAfter, parseISO, set, setDay } from "date-fns";

const WEEKDAY_NAMES = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

function toMillis(value: Date | number): number {
  return value instanceof Date ? value.getTime() : value;
}

/**
 * Formats the time left before a reset as `HH:MM:SS`.
 *
 * @param target The reset timestamp
 * @param now The current timestamp
 *
 * @note The hour field is not capped at 24. A weekly countdown can read `128:04:11`.
 */
export function formatCountdown(
  target: Date | number,
  now: Date | number
): string {
  const remaining = Math.max(0, toMillis(target) - toMillis(now));

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((part) => part.toString().padStart(2, "0"))
    .join(":");
}

/**
 * Formats the configured reset time as `HH:MM`, or as `Ddd HH:MM` for a weekly reset.
 *
 * @param hours Hour of the day (0-23)
 * @param minutes Minute of the hour (0-59)
 * @param day Day of the week (0-6), where 0 is Sunday
 */
export function formatResetLabel(
  hours: number,
  minutes: number,
  day?: number
): string {
  const time = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  if (typeof day !== "number") {
    return time;
  }

  return `${WEEKDAY_NAMES[day] ?? ""} ${time}`.trim();
}

export function formatDailyTime(hours: number, minutes: number): string {
  return (
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":00.000Z"
  );
}

function getTodayTimes(dailyTime: string): { now: Date; todayWithTime: Date } {
  const now = new Date();
  const todayDate = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

  const parsedTime = parseISO(`${todayDate}T${dailyTime}`);
  const hours = parsedTime.getHours();
  const minutes = parsedTime.getMinutes();
  const seconds = parsedTime.getSeconds();

  const todayWithTime = set(now, { hours, minutes, seconds, milliseconds: 0 });

  return { now, todayWithTime };
}

/**
 * Determines if the given reset time has happened on the current UTC date
 *
 * @param dailyTime In the format of `HH:mm:ss.sssZ`
 *
 * @note See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format
 */
export function hasResetHappenedToday(dailyTime: string): boolean {
  const { now, todayWithTime } = getTodayTimes(dailyTime);

  return isAfter(now, todayWithTime);
}

/**
 * Gets the next weekly reset timestamp
 *
 * @param dailyTime In the format of `HH:mm:ss.sssZ`
 * @param weeklyDay ISO date of the week (0-6)
 *
 * @note See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format
 */
export function hasResetHappenedThisWeek(
  dailyTime: string,
  weeklyDay: number
): boolean {
  const { now, todayWithTime } = getTodayTimes(dailyTime);

  const dayWithTime = setDay(todayWithTime, weeklyDay);

  return isAfter(now, dayWithTime);
}

/**
 * Gets the next daily reset timestamp
 *
 * @param dailyTime In the format of `HH:mm:ss.sssZ`
 *
 * @note See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format
 */
export function getNextDailyReset(dailyTime: string): Date {
  const { now, todayWithTime } = getTodayTimes(dailyTime);

  const isResetTomorrow = isAfter(now, todayWithTime);
  if (isResetTomorrow) {
    return addDays(todayWithTime, 1);
  }

  return todayWithTime;
}

/**
 * Gets the next weekly reset timestamp
 *
 * @param dailyTime In the format of `HH:mm:ss.sssZ`
 * @param weeklyDay ISO date of the week (0-6)
 *
 * @note See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format
 */
export function getNextWeeklyReset(dailyTime: string, weeklyDay: number): Date {
  const { now, todayWithTime } = getTodayTimes(dailyTime);

  let nextReset = setDay(todayWithTime, weeklyDay);

  const isResetNextWeek = isAfter(now, nextReset);
  if (isResetNextWeek) {
    nextReset = addWeeks(nextReset, 1);
  }

  return nextReset;
}
