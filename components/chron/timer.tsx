"use client";

import { memo, useEffect, useState } from "react";
import { getNextDailyReset, getNextWeeklyReset } from "@chron/lib/timer";

/**
 * dailyTime looks like `HH:mm:ss.sssZ`
 *
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format
 */
const Timer = memo(function Timer({
  dailyTime,
  weeklyDay,
  type,
}: {
  dailyTime: string;
  weeklyDay?: number;
  type: "daily" | "weekly";
}) {
  const [nextReset, setNextReset] = useState<Date | null>(null);

  useEffect(() => {
    let newReset: Date = new Date(0);

    if (type === "daily") {
      newReset = getNextDailyReset(dailyTime);
    } else if (type === "weekly") {
      newReset = getNextWeeklyReset(dailyTime, weeklyDay!);
    }

    setNextReset(newReset);
  }, [dailyTime, weeklyDay, type]);

  // TODO: Implement timer. Central store for timer countdown?
  return <span>{nextReset?.toISOString()}</span>;
});

export default Timer;
