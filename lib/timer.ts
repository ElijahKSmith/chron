import { addDays, addWeeks, isAfter, parseISO, set, setDay } from "date-fns";

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
