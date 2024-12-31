import { addDays, addWeeks, isAfter, parseISO, set, setDay } from "date-fns";

export function formatDailyTime(hours: number, minutes: number): string {
  return (
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":00.000Z"
  );
}

/**
 * Determines if the given reset time has happened on the current UTC date
 *
 * @param dailyTime In the format of `HH:mm:ss.sssZ`
 *
 * @note See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format
 */
export function hasResetHappenedToday(dailyTime: string): boolean {
  const parsedTime = parseISO(`1970-01-01T${dailyTime}`);
  const hours = parsedTime.getHours();
  const minutes = parsedTime.getMinutes();
  const seconds = parsedTime.getSeconds();

  const now = new Date();
  const todayWithTime = set(now, { hours, minutes, seconds, milliseconds: 0 });

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
  const parsedTime = parseISO(`1970-01-01T${dailyTime}`);
  const hours = parsedTime.getHours();
  const minutes = parsedTime.getMinutes();
  const seconds = parsedTime.getSeconds();

  const now = new Date();
  const dayWithTime = setDay(
    set(now, { hours, minutes, seconds, milliseconds: 0 }),
    weeklyDay
  );

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
  const parsedTime = parseISO(`1970-01-01T${dailyTime}`);
  const hours = parsedTime.getHours();
  const minutes = parsedTime.getMinutes();
  const seconds = parsedTime.getSeconds();

  let nextReset = set(new Date(), { hours, minutes, seconds, milliseconds: 0 });

  const isResetTomorrow = hasResetHappenedToday(dailyTime);
  if (isResetTomorrow) {
    nextReset = addDays(nextReset, 1);
  }

  return nextReset;
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
  const parsedTime = parseISO(`1970-01-01T${dailyTime}`);

  const hours = parsedTime.getHours();
  const minutes = parsedTime.getMinutes();
  const seconds = parsedTime.getSeconds();

  const now = new Date();
  let nextReset = setDay(
    set(now, { hours, minutes, seconds, milliseconds: 0 }),
    weeklyDay
  );

  const isResetNextWeek = hasResetHappenedThisWeek(dailyTime, weeklyDay);
  if (isResetNextWeek) {
    nextReset = addWeeks(nextReset, 1);
  }

  return nextReset;
}
