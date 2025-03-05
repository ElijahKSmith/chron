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
import { Spinner } from "@chron/components/ui/spinner";
import {
  createTask,
  deleteTask,
  getTask,
  getTasksByGameId,
  updateTaskDone,
  updateTaskOrder,
} from "@chron/lib/database";
import { error } from "@tauri-apps/plugin-log";

export default function Game({
  game,
  deleteGame,
}: {
  game: Omit<GameItem, "order">;
  deleteGame: (id: string) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);
  const [nextDaily, setNextDaily] = useState<Date | null>(null);
  const [nextWeekly, setNextWeekly] = useState<Date | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  const { currentTimestamp } = useTimer();

  const reorderTasks = useCallback((a: TaskItem[]) => {
    return a.map<TaskItem>((item, i) => ({ ...item, order: i }));
  }, []);

  const sortTasks = useCallback((a: TaskItem, b: TaskItem) => {
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
        order: (tasks[tasks.length - 1]?.order ?? 0) + 1,
        title,
        type,
        description,
        done: false,
        nextReset: null,
      };

      setTasks((prev) => prev.concat([newItem]));

      createTask(newItem, game.id).catch(error);
    },
    [tasks, game]
  );

  const removeTask = useCallback(
    (id: string) => {
      const newTasks = reorderTasks(tasks.filter((task) => task.id !== id));
      setTasks(newTasks);

      deleteTask(id)
        .then(() =>
          Promise.all(
            newTasks.map(async (task, i) => updateTaskOrder(task.id, i))
          )
        )
        .catch(error);
    },
    [tasks, reorderTasks]
  );

  const setDone = useCallback(
    (id: string, value: boolean) => {
      const item = tasks.find((item) => item.id === id);

      if (item) {
        item.done = value;

        if (value) {
          item.nextReset = item.type === "weekly" ? nextWeekly : nextDaily;
        } else {
          item.nextReset = null;
        }

        setTasks((prev) =>
          prev
            .filter((item) => item.id !== id)
            .concat([item])
            .sort(sortTasks)
        );

        updateTaskDone(item.id, item.done, item.nextReset).catch(error);
      }
    },
    [tasks, nextDaily, nextWeekly, sortTasks]
  );

  const refetchTask = useCallback((id: string) => {
    getTask(id)
      .then((newTask) =>
        setTasks((prev) => {
          const taskIndex = prev.findIndex((task) => task.id === id);

          if (taskIndex > -1) {
            prev[taskIndex] = newTask;
          } else {
            prev.push(newTask);
          }

          return prev;
        })
      )
      .catch(error);
  }, []);

  useEffect(() => {
    getTasksByGameId(game.id)
      .then((tasks) => setTasks(tasks))
      .catch(error)
      .finally(() => setLoading(false));
  }, [game]);

  useEffect(() => {
    const updatedTasks: TaskItem[] = [];

    tasks.forEach((task) => {
      if (
        task.done &&
        task.nextReset &&
        isAfter(currentTimestamp, task.nextReset)
      ) {
        task.nextReset = null;
        task.done = false;
        updatedTasks.push(task);
      }
    });

    if (updatedTasks.length > 0) {
      const updatedIds = updatedTasks.map((task) => task.id);

      setTasks((prev) =>
        prev
          .filter((task) => !updatedIds.includes(task.id))
          .concat(updatedTasks)
          .sort(sortTasks)
      );

      Promise.all(
        updatedTasks.map(async (task) =>
          updateTaskDone(task.id, task.done, task.nextReset)
        )
      ).catch(error);
    }
  }, [tasks, currentTimestamp, sortTasks]);

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
              <h4>{tasks.length} Tasks</h4>
            </div>
            <div>
              <TaskDialog gameTitle={game.title} addTask={addTask} />
            </div>
          </div>
          <CollapsibleContent className="flex flex-col gap-2 pt-2">
            {loading && <Spinner />}
            {!loading &&
              tasks.map((item) => (
                <Task
                  key={`task-${item.id}`}
                  task={item}
                  setDone={setDone}
                  refetchTask={refetchTask}
                  deleteTask={removeTask}
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
