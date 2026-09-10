import { Check, X } from "lucide-react";
import { TaskItem } from "@chron/lib/task";
import DeleteMenu from "@chron/components/chron/delete-menu";
import { cn } from "@chron/lib/utils";

const TASK_ENTER_STAGGER_MS = 35;

export default function Task({
  task,
  index,
  open,
  setDone,
  deleteTask,
}: {
  task: Omit<TaskItem, "order">;
  index: number;
  open: boolean;
  setDone: (id: string, value: boolean) => void;
  deleteTask: (id: string) => void;
}) {
  const isWeekly = task.type === "weekly";

  return (
    <div
      className={cn(
        "bg-task flex gap-[15px] rounded-[13px] border px-[15px] py-[13px]",
        "transition-[transform,opacity] duration-300 ease-[cubic-bezier(.2,.8,.2,1)]",
        open ? "translate-y-0 opacity-100" : "-translate-y-2.5 opacity-0"
      )}
      style={{ transitionDelay: `${open ? index * TASK_ENTER_STAGGER_MS : 0}ms` }}
    >
      <div className="flex flex-none flex-col self-start overflow-hidden rounded-[11px] border">
        <button
          type="button"
          title="Mark complete"
          onClick={() => setDone(task.id, true)}
          className="bg-complete/15 hover:bg-complete/30 text-complete grid h-7 w-8 place-items-center border-b transition-colors"
        >
          <Check className="size-[13px]" strokeWidth={2} />
          <span className="sr-only">Mark Done</span>
        </button>
        <button
          type="button"
          title="Mark incomplete"
          onClick={() => setDone(task.id, false)}
          className="bg-incomplete/12 hover:bg-incomplete/28 text-incomplete grid h-7 w-8 place-items-center transition-colors"
        >
          <X className="size-3" strokeWidth={2} />
          <span className="sr-only">Mark Undone</span>
        </button>
      </div>

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-[5px] pt-px transition-opacity",
          task.done && "opacity-40"
        )}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "text-[14.5px] font-semibold",
              task.done && "line-through"
            )}
          >
            {task.title}
          </div>
          <div
            className={cn(
              "flex-none rounded-full px-2 py-[3px] font-mono text-[9px] font-bold tracking-[0.14em]",
              isWeekly
                ? "bg-weekly/15 text-weekly"
                : "bg-daily/15 text-daily"
            )}
          >
            {task.type.toUpperCase()}
          </div>
        </div>
        {task.description && (
          <div
            className={cn(
              "text-muted-foreground max-w-[60ch] text-[12.5px] leading-[1.45] text-pretty",
              task.done && "line-through"
            )}
          >
            {task.description}
          </div>
        )}
      </div>

      <DeleteMenu
        type="Task"
        title={task.title}
        deleteItem={() => deleteTask(task.id)}
      />
    </div>
  );
}
