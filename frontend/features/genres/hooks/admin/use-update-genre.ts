import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { genreKeys } from "@/features/genres/api/keys";
import { useRouter } from "next/navigation";
import { UpdateGenreDto } from "../../genres.type";
import { updateGenre } from "../../api/client";

export const useUpdateGenre = () => {
  const qc = useQueryClient();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: ({
      genreId,
      values,
    }: {
      genreId: string;
      values: UpdateGenreDto;
    }) => updateGenre(genreId, values),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: genreKeys.all });
      qc.invalidateQueries({ queryKey: genreKeys.details(vars.genreId) });
      toast.success(`Genre updated successfully!`);
      router.replace("/admin/genres");
    },
  });

  return {
    updateGenre: mutate,
    isUpdating: isPending,
  };
};
