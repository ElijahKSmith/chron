"use client";

import { Button } from "@chron/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@chron/components/ui/dialog";
import { Input } from "@chron/components/ui/input";
import { Label } from "@chron/components/ui/label";
import { Textarea } from "@chron/components/ui/textarea";
import { useCallback, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@chron/components/ui/radio-group";
import { taskSchema, TaskType } from "@chron/lib/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@chron/components/ui/form";

export function TaskDialog({
  gameTitle,
  addTask,
}: {
  gameTitle: string;
  addTask: (
    title: string,
    type: z.infer<typeof TaskType>,
    description: string
  ) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      type: TaskType.enum.daily,
      description: "",
    },
  });

  const handleSubmit = useCallback(
    (values: z.infer<typeof taskSchema>) => {
      addTask(values.title, values.type, values.description);

      setDialogOpen(false);
    },
    [addTask]
  );

  const handleDialogOpenChange = useCallback(() => {
    form.reset();

    setDialogOpen((prev) => !prev);
  }, [form]);

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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
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
            <Button type="submit" disabled={!form.formState.isValid}>
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
