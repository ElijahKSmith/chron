"use client";

import {
  ComponentProps,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { cn } from "@chron/lib/utils";

type TimerContext = {
  currentTimestamp: Date;
};

const TimerContext = createContext<TimerContext | null>(null);

function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider.");
  }

  return context;
}

const TimerProvider = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, style, children, ...props }, ref) => {
    const [currentTimestamp, setCurrentTimestamp] = useState(new Date());

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTimestamp(new Date());
      }, 1000);

      return () => clearInterval(timer);
    }, []);

    const contextValue = useMemo<TimerContext>(
      () => ({ currentTimestamp }),
      [currentTimestamp]
    );

    return (
      <TimerContext.Provider value={contextValue}>
        <div style={style} className={cn(className)} ref={ref} {...props}>
          {children}
        </div>
      </TimerContext.Provider>
    );
  }
);
TimerProvider.displayName = "TimerProvider";

export { useTimer, TimerProvider };
