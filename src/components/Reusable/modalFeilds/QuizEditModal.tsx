// "use client";

// import * as React from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Plus, Trash2 } from "lucide-react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";
// import { toast } from "sonner";

// /* ─── Zod Schema ────────────────────────────────────────────── */
// const quizSchema = z.object({
//   title: z.string().min(1, "Question title is required"),
//   options: z
//     .array(z.string().min(1, "Option cannot be empty"))
//     .min(2, "At least 2 options required"),
//   answer: z.string().min(1, "Correct answer is required"),
// });

// const formSchema = z.object({
//   quizzes: z.array(quizSchema).min(1),
// });

// type FormValues = z.infer<typeof formSchema>;

// interface QuizEditModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   quiz: any; // single quiz object you want to edit
// }

// export function QuizEditModal({ open, onOpenChange, quiz }: QuizEditModalProps) {
//   const { data: session } = useSession();
//   const token = session?.user?.accessToken;
//   const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
//   const queryClient = useQueryClient();
// console.log(quiz)
//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       quizzes: [
//         {
//           title: "",
//           options: ["", ""],
//           answer: "",
//         },
//       ],
//     },
//   });

//   const { control, watch, handleSubmit, reset } = form;
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "quizzes",
//   });

//   // Reset form when modal opens + quiz data changes
//   React.useEffect(() => {
//     if (open && quiz) {
//       reset({
//         quizzes: [
//           {
//             title: quiz.title || "",
//             options: quiz.options?.length ? quiz.options : ["", ""],
//             answer: quiz.answer || quiz.correctAnswer || "",
//           },
//         ],
//       });
//     }
//   }, [open, quiz, reset]);

//   const quizzes = watch("quizzes");

//   const updateMutation = useMutation({
//     mutationFn: async (data: FormValues) => {
//       if (!token) throw new Error("Not authenticated");

//       // Since we're editing ONE quiz → we take first item
//       const quizData = data.quizzes[0];

//       const res = await fetch(`${API_BASE}/quizzes/${quiz._id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(quizData),
//       });

//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         throw new Error(errorData.message || "Failed to update quiz");
//       }

//       return res.json();
//     },
//     onSuccess: () => {
//       toast.success("Quiz updated successfully!");
//       queryClient.invalidateQueries({ queryKey: ["quizzes"] });
//       onOpenChange(false);
//     },
//     onError: (err: any) => {
//       toast.error(err.message || "Failed to update quiz");
//     },
//   });

//   const onSubmit = (data: FormValues) => {
//     updateMutation.mutate(data);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Edit Quiz</DialogTitle>
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
//             {fields.map((field, index) => (
//               <div
//                 key={field.id}
//                 className="border rounded-lg p-5 space-y-5 bg-gray-50/40"
//               >
//                 <div className="flex justify-between items-center">
//                   <h4 className="text-lg font-medium">Question</h4>
//                   {/* You can remove this if you want to force editing only one quiz */}
//                   {fields.length > 1 && (
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => remove(index)}
//                       className="text-red-600 hover:text-red-700"
//                     >
//                       <Trash2 className="h-4 w-4 mr-1" />
//                       Remove
//                     </Button>
//                   )}
//                 </div>

//                 {/* Title */}
//                 <FormField
//                   control={control}
//                   name={`quizzes.${index}.title`}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Question Title</FormLabel>
//                       <FormControl>
//                         <Input {...field} placeholder="Enter question..." />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Options */}
//                 <div className="space-y-3">
//                   <label className="text-sm font-medium">Options</label>

//                   {quizzes[index]?.options?.map((_, optIndex) => (
//                     <FormField
//                       key={optIndex}
//                       control={control}
//                       name={`quizzes.${index}.options.${optIndex}`}
//                       render={({ field }) => (
//                         <FormItem className="flex gap-3 items-center">
//                           <FormControl>
//                             <Input
//                               {...field}
//                               placeholder={`Option ${String.fromCharCode(
//                                 65 + optIndex
//                               )}`}
//                             />
//                           </FormControl>

//                           {quizzes[index].options.length > 2 && (
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               size="icon"
//                               className="h-8 w-8"
//                               onClick={() => {
//                                 const newOptions = [...quizzes[index].options];
//                                 newOptions.splice(optIndex, 1);
//                                 form.setValue(
//                                   `quizzes.${index}.options`,
//                                   newOptions
//                                 );
//                               }}
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           )}
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   ))}

//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={() => {
//                       form.setValue(`quizzes.${index}.options`, [
//                         ...quizzes[index].options,
//                         "",
//                       ]);
//                     }}
//                   >
//                     <Plus className="mr-2 h-4 w-4" />
//                     Add Option
//                   </Button>
//                 </div>

//                 {/* Correct Answer */}
//                 <FormField
//                   control={control}
//                   name={`quizzes.${index}.answer`}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Correct Answer</FormLabel>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           placeholder="Type the correct answer exactly..."
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             ))}

//             <DialogFooter className="pt-6 border-t">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => onOpenChange(false)}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={updateMutation.isPending}
//                 className="min-w-[140px]"
//               >
//                 {updateMutation.isPending ? "Saving..." : "Save Changes"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }


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
  DialogFooter,
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
import { Plus, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";


const quizSchema = z.object({
  title: z.string().min(1, "Question title is required"),
  options: z
    .array(z.string().min(1, "Option cannot be empty"))
    .min(2, "At least 2 options required"),
  answer: z.string().min(1, "Correct answer is required"),
});

const formSchema = z.object({
  quizzes: z.array(quizSchema).min(1),
});

type FormValues = z.infer<typeof formSchema>;

interface QuizEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: any; 
}

export function QuizEditModal({ open, onOpenChange, quiz }: QuizEditModalProps) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const queryClient = useQueryClient();
  console.log(quiz)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quizzes: [
        {
          title: "",
          options: ["", ""],
          answer: "",
        },
      ],
    },
  });

  const { control, watch, handleSubmit, reset } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "quizzes",
  });

  React.useEffect(() => {
    if (open && quiz) {
      reset({
        quizzes: [
          {
            title: quiz?.title ?? "",
            options:
              Array.isArray(quiz?.options) && quiz.options.length >= 2
                ? quiz.options
                : ["", ""],
            answer: quiz?.answer ?? quiz?.correctAnswer ?? "",
          },
        ],
      });
    }
  }, [open, quiz, reset]);

  const quizzes = watch("quizzes");

  const updateMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (!token) throw new Error("Not authenticated");

      // Since we're editing ONE quiz → we take first item
      const quizData = data.quizzes[0];

      const res = await fetch(`${API_BASE}/quizzes/${quiz._id}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(quizData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update quiz");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Quiz updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      onOpenChange(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update quiz");
    },
  });

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Quiz</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border rounded-lg p-5 space-y-5 bg-gray-50/40"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium">Question</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:text-red-700"
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
                      <FormLabel>Question Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter question..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Options */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Options</label>

                  {quizzes[index]?.options?.map((_, optIndex) => (
                    <FormField
                      key={optIndex}
                      control={control}
                      name={`quizzes.${index}.options.${optIndex}`}
                      render={({ field }) => (
                        <FormItem className="flex gap-3 items-center">
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
                              className="h-8 w-8"
                              onClick={() => {
                                const newOptions = [...quizzes[index].options];
                                newOptions.splice(optIndex, 1);
                                form.setValue(
                                  `quizzes.${index}.options`,
                                  newOptions
                                );
                              }}
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
                    onClick={() => {
                      form.setValue(`quizzes.${index}.options`, [
                        ...quizzes[index].options,
                        "",
                      ]);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Option
                  </Button>
                </div>

                {/* Correct Answer */}
                <FormField
                  control={control}
                  name={`quizzes.${index}.answer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correct Answer</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Type the correct answer exactly..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            <DialogFooter className="pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="min-w-[140px]"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
