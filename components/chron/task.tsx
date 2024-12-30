import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@chron/components/ui/card";
import { Button } from "@chron/components/ui/button";
import { Check, Trash, X } from "lucide-react";

export default function Task({
  id,
  title,
  type,
  description,
  done,
  setDone,
  deleteTask,
}: {
  id: string;
  title: string;
  type: "daily" | "weekly";
  description: string;
  done: boolean;
  setDone: (id: string, value: boolean) => void;
  deleteTask: (id: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {id}
          {done.toString()}
          {type[0].toUpperCase() + type.substring(1)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
      <CardFooter className="flex flex-row place-content-between">
        <div>
          <Button
            variant="ghost"
            className="text-green-500"
            onClick={() => setDone(id, true)}
          >
            <Check />
            <span className="sr-only">Mark Done</span>
          </Button>
          <Button
            variant="ghost"
            className="text-red-500"
            onClick={() => setDone(id, false)}
          >
            <X />
            <span className="sr-only">Mark Undone</span>
          </Button>
        </div>
        <div>
          <Button
            variant="ghost"
            className="text-red-700"
            onClick={() => deleteTask(id)}
          >
            <Trash />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
