import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGenre } from "../../api/client";
import { CreateGenreDto } from "../../genres.type";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { genreKeys } from "../../api/keys";

export const useCreateGenre = () => {
  const qc = useQueryClient();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateGenreDto) => {
      const payload = {
        ...values,
      };

      return createGenre(payload);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: genreKeys.all });
      toast.success(`${vars.name} created successfully!`);
      router.replace("/admin/genres");
    },
  });

  return {
    createGenre: mutate,
    isCreating: isPending,
  };
};
