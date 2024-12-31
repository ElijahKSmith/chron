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
import { useCallback, useEffect, useState } from "react";
import { Button } from "@chron/components/ui/button";
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import Task from "@chron/components/chron/task";
import { TaskDialog } from "@chron/components/chron/add-task";
import ResetTimer from "@chron/components/chron/reset-timer";
import { v4 } from "uuid";
import { TaskItem, TaskType } from "@chron/lib/task";
import { GameItem } from "@chron/lib/game";
import DeleteDialog from "@chron/components/chron/delete-item";
import { useTimer } from "@chron/components/chron/timer-context";
import { isAfter } from "date-fns";

export default function Game({
  game,
  deleteGame,
}: {
  game: Omit<GameItem, "order">;
  deleteGame: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const [nextDaily, setNextDaily] = useState<Date | null>(null);
  const [nextWeekly, setNextWeekly] = useState<Date | null>(null);
  const { currentTimestamp } = useTimer();

  const [items, setItems] = useState<TaskItem[]>([
    {
      id: v4(),
      order: 0,
      title: "Example Daily",
      type: "daily",
      description: "Go to the thing and turn in the thing",
      done: false,
      nextReset: null,
    },
    {
      id: v4(),
      order: 1,
      title: "Example Weekly",
      type: "weekly",
      description: "Farm the thing then go to thr thing and turn in the thing",
      done: true,
      nextReset: new Date(Date.now() + 604800000),
    },
  ]);

  const reorderItems = useCallback((a: TaskItem[]) => {
    return a.map<TaskItem>((item, i) => ({ ...item, order: i }));
  }, []);

  const sortItems = useCallback((a: TaskItem, b: TaskItem) => {
    if (a.order < b.order) {
      return -1;
    } else if (a.order > b.order) {
      return 1;
    } else {
      return 0;
    }
  }, []);

  const addTask = useCallback(
    (title: string, type: TaskType, description: string) => {
      const newItem: TaskItem = {
        id: v4(),
        order: (items[items.length - 1]?.order ?? 0) + 1,
        title,
        type,
        description,
        done: false,
        nextReset: null,
      };

      setItems((prev) => prev.concat([newItem]));
    },
    [items]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setItems((prev) => reorderItems(prev.filter((item) => item.id !== id)));
    },
    [reorderItems]
  );

  const setDone = useCallback(
    (id: string, value: boolean) => {
      const item = items.find((item) => item.id === id);

      if (item) {
        item.done = value;

        if (value) {
          item.nextReset = item.type === "weekly" ? nextWeekly : nextDaily;
        } else {
          item.nextReset = null;
        }

        setItems((prev) =>
          prev
            .filter((item) => item.id !== id)
            .concat([item])
            .sort(sortItems)
        );
      }
    },
    [items, nextDaily, nextWeekly, sortItems]
  );

  useEffect(() => {
    const changedItems: TaskItem[] = [];

    items.forEach((item) => {
      if (
        item.done &&
        item.nextReset &&
        isAfter(currentTimestamp, item.nextReset)
      ) {
        item.nextReset = null;
        item.done = false;
        changedItems.push(item);
      }
    });

    if (changedItems.length > 0) {
      const changedIds = changedItems.map((changedItem) => changedItem.id);

      console.log(items, changedItems, changedIds);

      setItems((prev) =>
        prev
          .filter((item) => !changedIds.includes(item.id))
          .concat(changedItems)
          .sort(sortItems)
      );
    }
  }, [items, currentTimestamp, sortItems]);

  return (
    <Card>
      <CardHeader className="flex-row items-center place-content-between">
        <CardTitle>{game.title}</CardTitle>
        <DeleteDialog
          type="Game"
          title={game.title}
          deleteItem={() => deleteGame(game.id)}
        />
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
              <TaskDialog gameTitle={game.title} addTask={addTask} />
            </div>
          </div>
          <CollapsibleContent className="flex flex-col gap-2 pt-2">
            {items.map((item) => (
              <Task
                key={`task-${item.id}`}
                task={item}
                setDone={setDone}
                deleteTask={deleteTask}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      <CardFooter className="flex-col items-start">
        <p>
          Daily reset is{" "}
          <ResetTimer
            hour={game.dailyHour}
            minute={game.dailyMinute}
            setReset={setNextDaily}
          />
        </p>
        <p>
          Weekly reset is{" "}
          <ResetTimer
            hour={game.dailyHour}
            minute={game.dailyMinute}
            day={game.weeklyDay}
            setReset={setNextWeekly}
          />
        </p>
      </CardFooter>
    </Card>
  );
}
