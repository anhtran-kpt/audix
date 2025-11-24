import { emptyStringToNull } from "@/features/common/utils/form-helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateArtist } from "../../api/client";
import { UpdateArtistDto } from "../../artists.type";
import { toast } from "sonner";
import { artistKeys } from "../../api/keys";
import { useRouter } from "next/navigation";

export const useUpdateArtist = () => {
  const qc = useQueryClient();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: ({
      artistId,
      values,
    }: {
      artistId: string;
      values: UpdateArtistDto;
    }) => {
      const payload = {
        ...values,
        bio: emptyStringToNull(values.bio),
        avatarId: emptyStringToNull(values.avatarId),
        avatarColor: emptyStringToNull(values.avatarColor),
        bannerId: emptyStringToNull(values.bannerId),
        bannerColor: emptyStringToNull(values.bannerColor),
      };

      return updateArtist(artistId, payload);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: artistKeys.all });
      qc.invalidateQueries({ queryKey: artistKeys.details(vars.artistId) });
      toast.success(`Artist updated successfully!`);
      router.replace("/admin/artists");
    },
  });

  return {
    updateArtist: mutate,
    isUpdating: isPending,
  };
};
