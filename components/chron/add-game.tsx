"use client";

import { Button } from "@chron/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@chron/components/ui/dialog";
import { Input } from "@chron/components/ui/input";
import { Label } from "@chron/components/ui/label";
import { useCallback, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@chron/components/ui/select";
import { formatDailyTime } from "@chron/lib/timer";
import { format, parseISO } from "date-fns";

export function GameDialog({
  addGame,
}: {
  addGame: (
    title: string,
    dailyHour: number,
    dailyMinute: number,
    weeklyDay: number
  ) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [dailyHour, setDailyHour] = useState(0);
  const [dailyMinute, setDailyMinute] = useState(0);
  const [weeklyDay, setWeeklyDay] = useState(0);

  const handleSubmit = useCallback(() => {
    addGame(title.trim(), dailyHour, dailyMinute, weeklyDay);

    setDialogOpen(false);
  }, [addGame, title, dailyHour, dailyMinute, weeklyDay]);

  const handleDialogOpenChange = useCallback(() => {
    setTitle("");
    setDailyHour(0);
    setDailyMinute(0);
    setWeeklyDay(0);

    setDialogOpen((prev) => !prev);
  }, []);

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Game</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Game</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-4"
            />
          </div>
          <div className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="dailyHour" className="text-right">
              Daily Reset (UTC)
            </Label>
            <Select
              value={dailyHour.toString()}
              onValueChange={(v) => setDailyHour(Number(v))}
            >
              <SelectTrigger id="dailyHour" className="col-span-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[...Array(24)].map((_, i) => (
                  <SelectItem key={`dailyHour-${i}`} value={i.toString()}>
                    {i.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={dailyMinute.toString()}
              onValueChange={(v) => setDailyMinute(Number(v))}
            >
              <SelectTrigger id="dailyMinute" className="col-span-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[...Array(60)].map((_, i) => (
                  <SelectItem key={`dailyMinute-${i}`} value={i.toString()}>
                    {i.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-5 items-center gap-4">
            <div></div>
            <div className="col-span-4">
              {format(
                parseISO(
                  `1970-01-01T${formatDailyTime(dailyHour, dailyMinute)}`
                ),
                "h:mm a"
              )}{" "}
              in local timezone
            </div>
          </div>
          <div className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="weeklyDay" className="text-right">
              Weekly Reset
            </Label>
            <Select
              value={weeklyDay.toString()}
              onValueChange={(v) => setWeeklyDay(Number(v))}
            >
              <SelectTrigger id="weeklyDay" className="col-span-4">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((day, i) => (
                  <SelectItem key={`weeklyDay-${i}`} value={i.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={title.trim().length < 1}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
