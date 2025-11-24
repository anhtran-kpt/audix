import { emptyStringToNull } from "@/features/common/utils/form-helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAlbum } from "../../api/client";
import { toast } from "sonner";
import { albumKeys } from "../../api/keys";
import { useRouter } from "next/navigation";
import { UpdateAlbumDto } from "../../albums.type";

export const useUpdateAlbum = () => {
  const qc = useQueryClient();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: ({
      albumId,
      values,
    }: {
      albumId: string;
      values: UpdateAlbumDto;
    }) => {
      const payload = {
        ...values,
        thumbnailId: emptyStringToNull(values.thumbnailId),
        thumbnailColor: emptyStringToNull(values.thumbnailColor),
      };

      return updateAlbum(albumId, payload);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: albumKeys.all });
      qc.invalidateQueries({ queryKey: albumKeys.detail(vars.albumId) });
      toast.success(`Album updated successfully!`);
      router.replace("/admin/albums");
    },
  });

  return {
    updateAlbum: mutate,
    isUpdating: isPending,
  };
};
