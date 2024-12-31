export interface TaskItem {
  id: string;
  order: number;
  title: string;
  type: TaskType;
  description: string;
  done: boolean;
  nextReset: Date | null;
}

export type TaskType = "daily" | "weekly";
