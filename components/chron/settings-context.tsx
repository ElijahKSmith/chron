"use client";

import {
  ComponentProps,
  createContext,
  Dispatch,
  forwardRef,
  SetStateAction,
  useContext,
  useMemo,
} from "react";
import { useLocalStorage } from "@chron/components/chron/use-local-storage";
import { GameSettings } from "@chron/lib/game-settings";
import { cn } from "@chron/lib/utils";

type SettingsContext = {
  gameSettings: GameSettings;
  setGameSettings: Dispatch<SetStateAction<GameSettings>>;
};

const SettingsContext = createContext<SettingsContext | null>(null);

function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider.");
  }

  return context;
}

const SettingsProvider = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, style, children, ...props }, ref) => {
    const [gameSettings, setGameSettings] = useLocalStorage<GameSettings>(
      "game-settings",
      { openTasksOnReset: true }
    );

    const contextValue = useMemo<SettingsContext>(
      () => ({ gameSettings, setGameSettings }),
      [gameSettings, setGameSettings]
    );

    return (
      <SettingsContext.Provider value={contextValue}>
        <div style={style} className={cn(className)} ref={ref} {...props}>
          {children}
        </div>
      </SettingsContext.Provider>
    );
  }
);
SettingsProvider.displayName = "SettingsProvider";

export { useSettings, SettingsProvider };
