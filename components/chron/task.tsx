import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@chron/components/ui/card";
import { Button } from "@chron/components/ui/button";
import { Check, X } from "lucide-react";
import { TaskItem } from "@chron/lib/task";
import DeleteDialog from "@chron/components/chron/delete-item";
import { cn } from "@chron/lib/utils";
import EditTaskDialog from "./edit-task";

interface TaskProps {
  task: Omit<TaskItem, "order">;
  setDone: (id: string, value: boolean) => void;
  updateAndRefetchTask: (
    id: string,
    newTask: Pick<TaskItem, "title" | "description" | "type">
  ) => void;
  deleteTask: (id: string) => void;
}

export default function Task({
  task,
  setDone,
  updateAndRefetchTask,
  deleteTask,
}: TaskProps) {
  return (
    <Card className={cn(task.done ? "line-through" : "")}>
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
        <CardDescription>
          {task.type[0].toUpperCase() + task.type.substring(1)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{task.description}</p>
      </CardContent>
      <CardFooter className="flex flex-row place-content-between">
        <div>
          <Button
            variant="ghost"
            className="text-green-500"
            onClick={() => setDone(task.id, true)}
          >
            <Check />
            <span className="sr-only">Mark Done</span>
          </Button>
          <Button
            variant="ghost"
            className="text-red-500"
            onClick={() => setDone(task.id, false)}
          >
            <X />
            <span className="sr-only">Mark Undone</span>
          </Button>
        </div>
        <div>
          <EditTaskDialog
            originalTask={task}
            onEditSuccess={updateAndRefetchTask}
          />
          <DeleteDialog
            type="Task"
            title={task.title}
            deleteItem={() => deleteTask(task.id)}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
