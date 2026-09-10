import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@chron/components/ui/dropdown-menu";
import DeleteDialog from "@chron/components/chron/delete-item";
import { MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@chron/lib/utils";

/**
 * The 3-dots menu that houses the delete action for a game or a task.
 *
 * @note The trigger stops click propagation because a game header is itself a
 * click target that expands and collapses the card.
 */
export default function DeleteMenu({
  type,
  title,
  deleteItem,
  className,
}: {
  type: "Game" | "Task";
  title: string;
  deleteItem: () => void;
  className?: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          onClick={(event) => event.stopPropagation()}
          className={cn(
            "grid size-7 place-items-center rounded-lg text-muted-foreground",
            "transition-colors hover:bg-foreground/10 hover:text-foreground",
            "focus-visible:ring-ring outline-hidden focus-visible:ring-2",
            className
          )}
        >
          <MoreVertical className="size-[15px]" />
          <span className="sr-only">{type} actions</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-[170px] rounded-[11px] p-1.5"
          onClick={(event) => event.stopPropagation()}
        >
          <DropdownMenuItem
            className="rounded-[7px] px-2.5 py-2 font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
            onSelect={() => setDialogOpen(true)}
          >
            <Trash2 />
            Delete {type.toLowerCase()}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteDialog
        type={type}
        title={title}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        deleteItem={deleteItem}
      />
    </>
  );
}
