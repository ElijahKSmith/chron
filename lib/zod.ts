import { z } from "zod";

export const gameSchema = z.object({
  title: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Title is required" : "Not a string",
    })
    .trim()
    .min(1, "Title is required"),
  dailyHour: z
    .number({
      error: (issue) =>
        issue.input === undefined ? "Daily hour is required" : "Not a number",
    })
    .min(0)
    .max(23),
  dailyMinute: z
    .number({
      error: (issue) =>
        issue.input === undefined ? "Daily minute is required" : "Not a number",
    })
    .min(0)
    .max(59),
  weeklyDay: z
    .number({
      error: (issue) =>
        issue.input === undefined ? "Weekly day is required" : "Not a number",
    })
    .min(0)
    .max(6),
});

export const TaskType = z.enum(["daily", "weekly"]);

export const taskSchema = z.object({
  title: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Title is required" : "Not a string",
    })
    .trim()
    .min(1, "Title is required"),
  type: TaskType,
  description: z.string().trim(),
});
