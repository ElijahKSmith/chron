import { useCallback, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import Task from "@chron/components/chron/task";
import { TaskDialog } from "@chron/components/chron/add-task";
import ResetTimer from "@chron/components/chron/reset-timer";
import { v4 } from "uuid";
import { TaskItem, TaskType } from "@chron/lib/task";
import { GameItem } from "@chron/lib/game";
import DeleteMenu from "@chron/components/chron/delete-menu";
import { useTimer } from "@chron/components/chron/timer-context";
import { cn } from "@chron/lib/utils";
import { isAfter } from "date-fns";
import { Spinner } from "@chron/components/ui/spinner";
import {
  createTask,
  deleteTask,
  getTasksByGameId,
  updateGameOpenState,
  updateTaskDone,
  updateTaskOrder,
} from "@chron/lib/database";
import { error } from "@tauri-apps/plugin-log";
import { useSettings } from "@chron/components/chron/settings-context";

export default function Game({
  game,
  deleteGame,
}: {
  game: Omit<GameItem, "order">;
  deleteGame: (id: string) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(game.open);
  const [nextDaily, setNextDaily] = useState<Date | null>(null);
  const [nextWeekly, setNextWeekly] = useState<Date | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  const { currentTimestamp } = useTimer();
  const { gameSettings } = useSettings();

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

  const openGame = useCallback(
    (open: boolean) => {
      setOpen(open);
      updateGameOpenState(game.id, open).catch(error);
    },
    [game]
  );

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

      if (gameSettings.openTasksOnReset) {
        openGame(true);
      }

      Promise.all(
        updatedTasks.map(async (task) =>
          updateTaskDone(task.id, task.done, task.nextReset)
        )
      ).catch(error);
    }
  }, [tasks, currentTimestamp, sortTasks]);

  const toggleOpen = useCallback(() => openGame(!open), [open, openGame]);

  return (
    <div className="bg-card rounded-[18px] border">
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        title="Expand or collapse"
        onClick={toggleOpen}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleOpen();
          }
        }}
        className="focus-visible:ring-ring flex cursor-pointer items-stretch rounded-[18px] outline-hidden focus-visible:ring-2"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-[18px] px-[22px] pt-[18px] pb-3.5">
          <div className="min-w-0 text-[25px] leading-[1.15] font-semibold tracking-[-0.025em] text-pretty">
            {game.title}
          </div>
          <div className="mt-auto flex items-center">
            <ChevronDown
              aria-hidden
              className={cn(
                "text-muted-foreground size-3.5 flex-none transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)]",
                !open && "rotate-180"
              )}
            />
            <div className="flex-1" />
            <DeleteMenu
              type="Game"
              title={game.title}
              deleteItem={() => deleteGame(game.id)}
            />
          </div>
        </div>
        {/* A weekly countdown runs to three hour digits, so the rail needs a
            pixel floor. The percentage alone clips it in a narrow window. */}
        <div className="flex w-[19%] max-w-1/2 min-w-[168px] flex-none flex-col border-l">
          <ResetTimer
            hour={game.dailyHour}
            minute={game.dailyMinute}
            setReset={setNextDaily}
            className="border-b"
          />
          <ResetTimer
            hour={game.dailyHour}
            minute={game.dailyMinute}
            day={game.weeklyDay}
            setReset={setNextWeekly}
          />
        </div>
      </div>

      <div
        className="grid transition-[grid-template-rows] duration-[360ms] ease-[cubic-bezier(.2,.8,.2,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        {/* A collapsed list is only clipped, so its buttons stay focusable
            without inert. */}
        <div className="min-h-0 overflow-hidden" inert={!open}>
          <div className="flex flex-col gap-2 px-3 pt-3.5 pb-3">
            {loading && <Spinner />}
            {!loading &&
              tasks.map((item, i) => (
                <Task
                  key={`task-${item.id}`}
                  task={item}
                  index={i}
                  open={open}
                  setDone={setDone}
                  deleteTask={removeTask}
                />
              ))}
            <TaskDialog gameTitle={game.title} addTask={addTask} />
          </div>
        </div>
      </div>
    </div>
  );
}
