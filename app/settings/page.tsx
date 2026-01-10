"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@chron/components/ui/dropdown-menu";
import { Button } from "@chron/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@chron/components/ui/accordion";
import { Switch } from "@chron/components/ui/switch";
import { Label } from "@chron/components/ui/label";
import { useSettings } from "@chron/components/chron/settings-context";
import { useCallback } from "react";

export default function Settings() {
  const { setTheme } = useTheme();
  const { gameSettings, setGameSettings } = useSettings();

  const openTasksOnResetChange = useCallback(
    (value: boolean) => {
      setGameSettings((prev) => ({ ...prev, openTasksOnReset: value }));
    },
    [setGameSettings]
  );

  return (
    <div className="flex flex-col gap-2 px-7">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["app-settings", "game-settings"]}
      >
        <AccordionItem value="app-settings">
          <AccordionTrigger>App Settings</AccordionTrigger>
          <AccordionContent className="flex flex-row items-center gap-4">
            <div>Theme</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle Theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="game-settings">
          <AccordionTrigger>Game Settings</AccordionTrigger>
          <AccordionContent className="flex flex-row items-center gap-4">
            <Switch
              id="game-reset-collapse"
              checked={gameSettings.openTasksOnReset}
              onCheckedChange={openTasksOnResetChange}
            />
            <Label htmlFor="game-reset-collapse">Open Tasks On Reset</Label>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
