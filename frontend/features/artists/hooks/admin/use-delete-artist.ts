import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { artistKeys } from "../../api/keys";
import { deleteArtist } from "../../api/client";

export const useDeleteArtist = () => {
  const qc = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: (id: string) => {
      return deleteArtist(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: artistKeys.all });
      toast.success("Artist deleted successfully");
    },
  });

  return { deleteArtist: mutateAsync };
};
