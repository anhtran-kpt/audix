import { emptyStringToNull } from "@/features/common/utils/form-helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { songKeys } from "../api/keys";
import { createSong } from "../api/client";
import { CreateSongDto } from "../songs.type";

export const useCreateSong = () => {
  const qc = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateSongDto) => {
      const payload = {
        ...values,
        lyrics: emptyStringToNull(values.lyrics),
      };

      return createSong(payload);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: songKeys.all });
    },
  });

  return {
    createSong: mutate,
    isCreating: isPending,
  };
};
