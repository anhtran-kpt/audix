import { emptyStringToNull } from "@/features/common/utils/form-helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createArtist } from "../../api/client";
import { CreateArtistDto } from "../../artists.type";
import { toast } from "sonner";
import { artistKeys } from "../../api/keys";
import { useRouter } from "next/navigation";

export const useCreateArtist = () => {
  const qc = useQueryClient();
  const router = useRouter();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: CreateArtistDto) => {
      const payload = {
        ...values,
        bio: emptyStringToNull(values.bio),
        avatarId: emptyStringToNull(values.avatarId),
        avatarColor: emptyStringToNull(values.avatarColor),
        bannerId: emptyStringToNull(values.bannerId),
        bannerColor: emptyStringToNull(values.bannerColor),
      };

      return createArtist(payload);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: artistKeys.all });
      toast.success(`${vars.name} created successfully!`);
      router.replace("/admin/artists");
    },
  });

  return {
    createArtist: mutateAsync,
    isCreating: isPending,
  };
};
