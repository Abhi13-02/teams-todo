// src/pages/user/CreateTaskPage.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "../../redux/features/tasks/taskThunks";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@shadcn/ui";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"]),
  dueDate: z.string().optional(),
});

export default function CreateTaskPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.tasks);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      priority: "Medium",
      dueDate: "",
    },
  });

  const onSubmit = (data) => {
    dispatch(createTask(data))
      .unwrap()
      .then(() => navigate("/app/tasks"))
      .catch(() => {});
  };

  return (
    <Card className="max-w-2xl mx-auto bg-gray-900 text-gray-100">
      <CardHeader>
        <CardTitle className="text-2xl">Create New Task</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-400 mb-4">{error}</p>}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField name="title" control={form.control} render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Task title ..." {...field} />
                </FormControl>
                {fieldState.error && <p className="text-red-400">{fieldState.error.message}</p>}
              </FormItem>
            )} />

            {/* Description */}
            <FormField name="description" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Task description..." {...field} />
                </FormControl>
              </FormItem>
            )} />

            {/* Priority */}
            <FormField name="priority" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Low", "Medium", "High"].map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )} />

            {/* Due Date */}
            <FormField name="dueDate" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )} />

            {/* Submit button */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
