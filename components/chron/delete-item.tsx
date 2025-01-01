"use client";

import { Button } from "@chron/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@chron/components/ui/dialog";
import { Check, Trash, X } from "lucide-react";
import { useCallback, useState } from "react";

export default function DeleteDialog({
  title,
  type,
  deleteItem,
}: {
  title: string;
  type: "Game" | "Task";
  deleteItem: () => void;
}) {
  const [open, setOpen] = useState(false);

  const handleConfirm = useCallback(() => {
    deleteItem();
    setOpen(false);
  }, [deleteItem]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-red-700">
          <Trash />
          <span className="sr-only">Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete {type}</DialogTitle>
        </DialogHeader>
        <div>Are you sure that you want to delete {title}?</div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" className="text-red-500">
              <X />
              <span className="sr-only">Cancel</span>
            </Button>
          </DialogClose>
          <Button
            variant="ghost"
            className="text-green-500"
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
