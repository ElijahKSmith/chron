"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@chron/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@chron/components/ui/card";
import { useCallback, useState } from "react";
import { Button } from "@chron/components/ui/button";
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import Task from "@chron/components/chron/task";
import { TaskDialog } from "@chron/components/chron/add-task";
import Timer from "./timer";

export default function Game({
  title,
  dailyTime,
  weeklyDay,
}: {
  title: string;
  dailyTime: string;
  weeklyDay: number;
}) {
  const [open, setOpen] = useState(true);

  const [items, setItems] = useState<
    {
      id: string;
      title: string;
      type: "daily" | "weekly";
      description: string;
      done: boolean;
    }[]
  >([
    {
      id: "0",
      title: "Example Daily",
      type: "daily",
      description: "Go to the thing and turn in the thing",
      done: false,
    },
    {
      id: "1",
      title: "Example Weekly",
      type: "weekly",
      description: "Farm the thing then go to thr thing and turn in the thing",
      done: true,
    },
  ]);

  const addTask = useCallback(
    (title: string, type: "daily" | "weekly", description: string) => {
      const newItem = {
        id: String((Number(items[items.length - 1]?.id) || 0) + 1), // TODO: Better ID system than incremental ints (UIDs)
        title,
        type,
        description,
        done: false,
      };

      setItems((prev) => prev.concat([newItem]));
    },
    [items]
  );

  const deleteTask = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const setDone = useCallback(
    (id: string, value: boolean) => {
      const item = items.find((item) => item.id === id);

      if (item) {
        item.done = value;

        setItems((prev) =>
          prev
            .filter((item) => item.id !== id)
            .concat([item])
            // TODO: Remove/change this sort after altering ids
            .sort((a, b) => {
              if (Number(a.id) < Number(b.id)) {
                return -1;
              } else if (Number(a.id) > Number(b.id)) {
                return 1;
              } else {
                return 0;
              }
            })
        );
      }
    },
    [items]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Collapsible open={open} onOpenChange={setOpen}>
          <div className="flex flex-row place-items-center place-content-between">
            <div className="flex flex-row place-items-center">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {open ? (
                    <ChevronsUpDown className="h-4 w-4" />
                  ) : (
                    <ChevronsDownUp className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
              <h4>{items.length} Tasks</h4>
            </div>
            <div>
              <TaskDialog gameTitle={title} addTask={addTask} />
            </div>
          </div>
          <CollapsibleContent className="flex flex-col gap-2 pt-2">
            {items.map((item) => (
              <Task
                key={`task-${item.id}`}
                id={item.id}
                title={item.title}
                type={item.type}
                description={item.description}
                done={item.done}
                setDone={setDone}
                deleteTask={deleteTask}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      <CardFooter className="flex-col items-start">
        <p>
          Daily reset in <Timer type="daily" dailyTime={dailyTime} />
        </p>
        <p>
          Weekly reset in{" "}
          <Timer type="weekly" dailyTime={dailyTime} weeklyDay={weeklyDay} />
        </p>
      </CardFooter>
    </Card>
  );
}
