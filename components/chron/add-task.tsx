"use client";

import { Button } from "@chron/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@chron/components/ui/dialog";
import { Input } from "@chron/components/ui/input";
import { Label } from "@chron/components/ui/label";
import { Textarea } from "@chron/components/ui/textarea";
import { useCallback, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@chron/components/ui/radio-group";

export function TaskDialog({
  gameTitle,
  addTask,
}: {
  gameTitle: string;
  addTask: (
    title: string,
    type: "daily" | "weekly",
    description: string
  ) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"daily" | "weekly">("daily");
  const [description, setDescription] = useState("");

  const handleSubmit = useCallback(() => {
    addTask(title, type, description);

    setDialogOpen(false);
  }, [addTask, title, type, description]);

  const handleDialogOpenChange = useCallback(() => {
    setTitle("");
    setType("daily");
    setDescription("");

    setDialogOpen((prev) => !prev);
  }, []);

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add {gameTitle} Task</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <RadioGroup
              value={type}
              onValueChange={(e: "daily" | "weekly") => setType(e)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="r1" />
                <Label htmlFor="r1">Daily</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="r2" />
                <Label htmlFor="r2">Weekly</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
