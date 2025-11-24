"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Genre } from "@/features/common/types/entity.type";
import { useCreateGenre } from "../../hooks/admin/use-create-genre";
import { useUpdateGenre } from "../../hooks/admin/use-update-genre";
import {
  genreFormSchema,
  GenreFormValues,
} from "@/features/genres/schemas/genre-form.schema";

interface GenreFormProps {
  initialData?: Genre;
}

export function GenreForm({ initialData }: GenreFormProps) {
  const { createGenre, isCreating } = useCreateGenre();
  const { updateGenre, isUpdating } = useUpdateGenre();

  const isEditMode = !!initialData;

  const action = isEditMode ? "Save Changes" : "Create Genre";
  const loadingAction = isEditMode ? "Saving..." : "Creating...";

  const form = useForm<GenreFormValues>({
    resolver: zodResolver(genreFormSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  const onSubmit = async (values: GenreFormValues) => {
    try {
      initialData
        ? updateGenre({ genreId: initialData.id, values })
        : createGenre(values);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="max-w-2xl mx-auto p-6 border rounded-lg bg-background shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Genre name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 mt-8">
            <Button key="submit-btn" type="submit" disabled={isLoading}>
              {isLoading ? loadingAction : action}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
