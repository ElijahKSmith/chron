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

export default function Task({
  task,
  setDone,
  deleteTask,
}: {
  task: Omit<TaskItem, "order">;
  setDone: (id: string, value: boolean) => void;
  deleteTask: (id: string) => void;
}) {
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
