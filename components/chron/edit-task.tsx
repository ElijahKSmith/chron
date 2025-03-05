"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@chron/components/ui/dialog";
import { useCallback, useState } from "react";
import { Button } from "@chron/components/ui/button";
import { Pencil } from "lucide-react";

interface EditTaskDialogProps {
  onEditSuccess: () => void;
}

export default function EditTaskDialog({ onEditSuccess }: EditTaskDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = useCallback(() => {
    onEditSuccess();
    setOpen(false);
  }, [onEditSuccess]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Pencil />
          <span className="sr-only">Edit Task</span>
        </Button>
      </DialogTrigger>
      <DialogContent></DialogContent>
    </Dialog>
  );
}
