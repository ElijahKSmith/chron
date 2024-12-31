"use client";

import { memo, useEffect, useState } from "react";
import {
  formatDailyTime,
  getNextDailyReset,
  getNextWeeklyReset,
} from "@chron/lib/timer";
import { useTimer } from "@chron/components/chron/timer-context";
import { formatDistanceStrict } from "date-fns";

/**
 * @param hour Hour of the day (0-23)
 * @param minute Minute of the hour (0-59)
 * @param day Day of the week (0-6)
 *
 * @note See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format
 */
const ResetTimer = memo(function ResetTimer({
  hour,
  minute,
  day,
  setReset,
}: {
  hour: number;
  minute: number;
  day?: number;
  setReset: (value: Date) => void;
}) {
  const [resetCountdown, setResetCountdown] = useState<string>("");
  const { currentTimestamp } = useTimer();

  useEffect(() => {
    const interval = setInterval(() => {
      let nextReset: Date = new Date(0);

      const dailyTime = formatDailyTime(hour, minute);

      if (typeof day === "number") {
        nextReset = getNextWeeklyReset(dailyTime, day!);
      } else {
        nextReset = getNextDailyReset(dailyTime);
      }

      setReset(nextReset);

      setResetCountdown(
        formatDistanceStrict(nextReset, currentTimestamp, {
          addSuffix: true,
        })
      );
    }, 500);

    return () => clearInterval(interval);
  }, [hour, minute, day, setReset, currentTimestamp]);

  return <span>{resetCountdown}</span>;
});

export default ResetTimer;
