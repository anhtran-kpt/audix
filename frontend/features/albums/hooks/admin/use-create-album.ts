import { emptyStringToNull } from "@/features/common/utils/form-helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAlbum } from "../../api/client";
import { CreateAlbumDto } from "../../albums.type";
import { toast } from "sonner";
import { albumKeys } from "../../api/keys";
import { useRouter } from "next/navigation";

export const useCreateAlbum = () => {
  const qc = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateAlbumDto) => {
      const payload = {
        ...values,
        thumbnailId: emptyStringToNull(values.thumbnailId),
        thumbnailColor: emptyStringToNull(values.thumbnailColor),
      };

      return createAlbum(payload);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: albumKeys.all });
      toast.success(`${vars.title} created successfully!`);
      router.replace("/admin/albums");
    },
  });

  return {
    createAlbum: mutate,
    isCreating: isPending,
  };
};
