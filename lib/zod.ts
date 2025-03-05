import { z } from "zod";

export const gameSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title is required"),
  dailyHour: z
    .number({ required_error: "Daily hour is required" })
    .min(0)
    .max(23),
  dailyMinute: z
    .number({ required_error: "Daily minute is required" })
    .min(0)
    .max(59),
  weeklyDay: z
    .number({ required_error: "Weekly day is required" })
    .min(0)
    .max(6),
});

export const TaskType = z.enum(["daily", "weekly"]);

export const taskSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  type: TaskType,
  description: z.string().optional(),
});
