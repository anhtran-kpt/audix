import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteGenre } from "../../api/client";
import { genreKeys } from "../../api/keys";

export const useDeleteGenre = () => {
  const qc = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: (id: string) => deleteGenre(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: genreKeys.all });
      toast.success("Genre deleted successfully");
    },
  });

  return { deleteGenre: mutateAsync };
};
