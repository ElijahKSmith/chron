"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@chron/components/ui/dialog";
import { useCallback, useState } from "react";
import { Button } from "@chron/components/ui/button";
import { Pencil } from "lucide-react";
import { taskSchema } from "@chron/lib/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@chron/components/ui/form";
import { Input } from "@chron/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@chron/components/ui/radio-group";
import { Label } from "@chron/components/ui/label";
import { Textarea } from "@chron/components/ui/textarea";
import { TaskItem } from "@chron/lib/task";

interface EditTaskDialogProps {
  originalTask: Pick<TaskItem, "id" | "title" | "description" | "type">;
  onEditSuccess: (
    id: string,
    newTask: Pick<TaskItem, "title" | "description" | "type">
  ) => void;
}

export default function EditTaskDialog({
  originalTask,
  onEditSuccess,
}: EditTaskDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    mode: "onChange",
    defaultValues: {
      title: originalTask.title,
      description: originalTask.description,
      type: originalTask.type,
    },
  });

  const handleConfirm = useCallback(
    (values: z.infer<typeof taskSchema>) => {
      onEditSuccess(originalTask.id, values);

      setDialogOpen(false);
    },
    [originalTask, onEditSuccess]
  );

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Pencil />
          <span className="sr-only">Edit Task</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleConfirm)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Title</FormLabel>
                  <FormControl>
                    <Input className="col-span-3" {...field} />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="col-span-3"
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Description</FormLabel>
                  <FormControl>
                    <Textarea className="col-span-3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-4 items-center gap-4">
              <Button
                type="submit"
                className="col-start-4 col-span-1"
                disabled={!form.formState.isValid}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
