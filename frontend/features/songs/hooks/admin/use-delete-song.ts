import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { songKeys } from "../../api/keys";
import { deleteSong } from "../../api/client";

export const useDeleteSong = () => {
  const qc = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: (id: string) => deleteSong(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: songKeys.all });
      toast.success("Song deleted successfully");
    },
  });

  return { deleteSong: mutateAsync };
};
