import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { albumKeys } from "../../api/keys";
import { deleteAlbum } from "../../api/client";

export const useDeleteAlbum = () => {
  const qc = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: (id: string) => {
      return deleteAlbum(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: albumKeys.all });
      toast.success("Album deleted successfully");
    },
  });

  return { deleteAlbum: mutateAsync };
};
