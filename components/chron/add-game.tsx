"use client";

import { Button } from "@chron/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@chron/components/ui/dialog";
import { Input } from "@chron/components/ui/input";
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
import { gameSchema } from "@chron/lib/zod";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@chron/components/ui/form";

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

  const form = useForm<z.infer<typeof gameSchema>>({
    resolver: zodResolver(gameSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      dailyHour: 0,
      dailyMinute: 0,
      weeklyDay: 0,
    },
  });

  const [dailyHour, dailyMinute] = useWatch({
    control: form.control,
    name: ["dailyHour", "dailyMinute"],
  });

  const handleSubmit = useCallback(
    (values: z.infer<typeof gameSchema>) => {
      addGame(
        values.title,
        values.dailyHour,
        values.dailyMinute,
        values.weeklyDay
      );

      setDialogOpen(false);
    },
    [addGame]
  );

  const handleDialogOpenChange = useCallback(() => {
    form.reset();

    setDialogOpen((prev) => !prev);
  }, [form]);

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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="grid grid-cols-5 items-center gap-4">
                  <FormLabel className="text-right">Title</FormLabel>
                  <FormControl>
                    <Input className="col-span-4" {...field} />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-4" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-5 items-center gap-4">
              <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 col-span-1 text-right">
                Daily Reset (UTC)
              </div>
              <FormField
                control={form.control}
                name="dailyHour"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[...Array(24)].map((_, i) => (
                          <SelectItem
                            key={`dailyHour-${i}`}
                            value={i.toString()}
                          >
                            {i.toString().padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dailyMinute"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[...Array(60)].map((_, i) => (
                          <SelectItem
                            key={`dailyMinute-${i}`}
                            value={i.toString()}
                          >
                            {i.toString().padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-5 items-center gap-4">
              <div className="col-start-2 col-span-4">
                {format(
                  parseISO(
                    `1970-01-01T${formatDailyTime(dailyHour, dailyMinute)}`
                  ),
                  "h:mm a"
                )}{" "}
                in local timezone
              </div>
            </div>
            <FormField
              control={form.control}
              name="weeklyDay"
              render={({ field }) => (
                <FormItem className="grid grid-cols-5 items-center gap-4">
                  <FormLabel className="text-right">Weekly Reset</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="col-span-4">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
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
                  <FormMessage className="col-start-2 col-span-4" />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!form.formState.isValid}>
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
