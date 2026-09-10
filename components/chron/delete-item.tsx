import { Button } from "@chron/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@chron/components/ui/dialog";
import { Check, X } from "lucide-react";
import { useCallback } from "react";

/**
 * @note This dialog is controlled by its caller. A `DropdownMenu` unmounts its
 * content when an item is selected, so the dialog cannot live inside the menu.
 * The caller renders it as a sibling of the menu and owns the `open` state.
 */
export default function DeleteDialog({
  title,
  type,
  open,
  onOpenChange,
  deleteItem,
}: {
  title: string;
  type: "Game" | "Task";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deleteItem: () => void;
}) {
  const handleConfirm = useCallback(() => {
    deleteItem();
    onOpenChange(false);
  }, [deleteItem, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete {type}</DialogTitle>
        </DialogHeader>
        <div>Are you sure that you want to delete {title}?</div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" className="text-incomplete">
              <X />
              <span className="sr-only">Cancel</span>
            </Button>
          </DialogClose>
          <Button
            variant="ghost"
            className="text-complete"
            onClick={() => handleConfirm()}
          >
            <Check />
            <span className="sr-only">Confirm</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
