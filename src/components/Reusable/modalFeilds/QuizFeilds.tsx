"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

/* ─── Zod Schema ────────────────────────────────────────────── */
const quizSchema = z.object({
  title: z.string().min(1, "Quiz title is required"),
  options: z
    .array(z.string().min(1, "Option cannot be empty"))
    .min(2, "At least 2 options required"),
  answer: z.string().min(1, "Correct answer is required"),
});

const formSchema = z.object({
  courseId: z.string().min(1, "Select a course"),
  videoId: z.string().min(1, "Select a video"),
  quizzes: z.array(quizSchema).min(1),
});

type FormValues = z.infer<typeof formSchema>;

interface QuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuizModal({ open, onOpenChange }: QuizModalProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
      videoId: "",
      quizzes: [{ title: "", options: ["", ""], answer: "" }],
    },
  });

  const { control, watch, handleSubmit, reset } = form;
  const queryClient = useQueryClient();

  const { data: sessionData } = useSession();
  const token = sessionData?.user?.accessToken;
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;


  const { data: apiResponse } = useQuery({
    queryKey: ["courses", token],
    queryFn: async () => {
      if (!token) throw new Error("Authentication required");
      const res = await fetch(`${API_BASE}/course`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch courses");
      return res.json();
    },
    enabled: !!token,
  });
  const courses = apiResponse?.data || [];


  const quizzes = watch("quizzes");
  const selectedCourseId = watch("courseId");

  // Find videos for selected course dynamically
  const availableVideos =
    courses.find(c => c._id === selectedCourseId)?.courseVideo || [];

  const { fields: quizFields, append, remove } = useFieldArray({
    control,
    name: "quizzes",
  });


  const createQuiz = useMutation({
    mutationFn: async (data: FormValues) => {
      if (!token) throw new Error("Authentication token missing");

      const response = await fetch(`${API_BASE}/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to create quizzes");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Quizzes created successfully!");
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      reset();
      onOpenChange(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Something went wrong");
      console.error(err);
    },
  });

  const onSubmit = (data: FormValues) => {
    createQuiz.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Quizzes</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Course Select */}
            <FormField
              control={control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map(c => (
                          <SelectItem key={c._id} value={c._id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Video Select */}
            <FormField
              control={control}
              name="videoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video / Lesson</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedCourseId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select video" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVideos.map(v => (
                          <SelectItem key={v._id} value={v._id}>
                            {v.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quizzes */}
            <div className="space-y-6">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Quizzes</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({ title: "", options: ["", ""], answer: "" })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Quiz
                </Button>
              </div>

              {quizFields.map((quiz, index) => (
                <div key={quiz.id} className="border rounded-lg p-5 space-y-5">
                  <div className="flex justify-between">
                    <h4>Quiz {index + 1}</h4>
                    {quizFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Title */}
                  <FormField
                    control={control}
                    name={`quizzes.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Quiz title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Options */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Options</label>
                    {quizzes[index].options.map((_, optIndex) => (
                      <FormField
                        key={optIndex}
                        control={control}
                        name={`quizzes.${index}.options.${optIndex}`}
                        render={({ field }) => (
                          <FormItem className="flex gap-2 items-center">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={`Option ${String.fromCharCode(
                                  65 + optIndex
                                )}`}
                              />
                            </FormControl>

                            {quizzes[index].options.length > 2 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  form.setValue(
                                    `quizzes.${index}.options`,
                                    quizzes[index].options.filter(
                                      (_, i) => i !== optIndex
                                    )
                                  )
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        form.setValue(`quizzes.${index}.options`, [
                          ...quizzes[index].options,
                          "",
                        ])
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Option
                    </Button>
                  </div>

                  {/* Answer */}
                  <FormField
                    control={control}
                    name={`quizzes.${index}.answer`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correct Answer</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Correct answer" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Quizzes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
