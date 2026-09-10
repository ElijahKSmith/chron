import { memo, useEffect } from "react";
import {
  formatCountdown,
  formatDailyTime,
  formatResetLabel,
  getNextDailyReset,
  getNextWeeklyReset,
} from "@chron/lib/timer";
import { useTimer } from "@chron/components/chron/timer-context";
import { cn } from "@chron/lib/utils";

/**
 * @param hour Hour of the day (0-23)
 * @param minute Minute of the hour (0-59)
 * @param day Day of the week (0-6), where 0 is Sunday
 *
 * @note See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format
 */
const ResetTimer = memo(function ResetTimer({
  hour,
  minute,
  day,
  setReset,
  className,
}: {
  hour: number;
  minute: number;
  day?: number;
  setReset: (value: Date) => void;
  className?: string;
}) {
  const { currentTimestamp } = useTimer();

  const isWeekly = typeof day === "number";

  // getNextDailyReset and getNextWeeklyReset read the wall clock, so the result
  // is computed on every tick instead of being memoized on the inputs.
  const dailyTime = formatDailyTime(hour, minute);
  const resetTime = (
    isWeekly ? getNextWeeklyReset(dailyTime, day) : getNextDailyReset(dailyTime)
  ).getTime();

  useEffect(() => {
    setReset(new Date(resetTime));
  }, [resetTime, setReset]);

  return (
    <div
      className={cn(
        "flex flex-1 flex-col justify-center gap-[3px] px-[18px] py-3",
        className
      )}
    >
      <div className="font-mono text-[9.5px] font-semibold tracking-[0.16em] text-muted-foreground">
        {isWeekly ? "WEEKLY" : "DAILY"}
      </div>
      <div
        className={cn(
          "font-mono text-[19px] font-medium tracking-[-0.02em] tabular-nums",
          isWeekly ? "text-weekly" : "text-daily"
        )}
      >
        {formatCountdown(resetTime, currentTimestamp)}
      </div>
      <div className="text-muted-foreground/80 text-[10.5px] whitespace-nowrap">
        resets {formatResetLabel(hour, minute, day)}
      </div>
    </div>
  );
});

export default ResetTimer;
