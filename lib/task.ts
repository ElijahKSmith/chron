export interface TaskItem {
  id: string;
  order: number;
  title: string;
  type: TaskType;
  description: string;
  done: boolean;
  nextReset: Date | null;
  closed: boolean;
}

export type TaskType = "daily" | "weekly";
