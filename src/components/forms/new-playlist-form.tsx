"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postApi } from "@/lib/http/request";
import { toast } from "sonner";
import {
  CreatePlaylistInput,
  CreatePlaylistInputSchema,
  CreatePlaylistOutput,
  SidebarPlaylist,
  UserPlaylist,
} from "@/features/playlist/contracts/playlist-dto";
import { playlistKeys } from "@/features/playlist/query/playlist-keys";
import { useSession } from "next-auth/react";

export const NewPlaylistForm = ({
  onSuccess,
}: {
  onSuccess: (res: CreatePlaylistOutput) => void;
}) => {
  const { data: session } = useSession();
  const form = useForm<CreatePlaylistInput>({
    resolver: zodResolver(CreatePlaylistInputSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      isPublic: true,
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = form;

  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => postApi<CreatePlaylistOutput>("/playlists", data),
    onMutate: async (vars: CreatePlaylistInput) => {
      await qc.cancelQueries({ queryKey: playlistKeys.sidebarPlaylists() });

      const previousPlaylists = qc.getQueryData<SidebarPlaylist[]>(
        playlistKeys.sidebarPlaylists()
      );

      const optimistic: SidebarPlaylist = {
        id: `optimistic-${Date.now()}`,
        title: vars.title,
        imageId: null,
        user: {
          name: session?.user.name ?? "",
          id: `optimistic-${Date.now()}`,
        },
      };

      qc.setQueryData<SidebarPlaylist[]>(
        playlistKeys.sidebarPlaylists(),
        (old) => (old ? [optimistic, ...old] : [optimistic])
      );

      return { previousPlaylists };
    },
    onError: (err, _, ctx) => {
      if (ctx?.previousPlaylists) {
        qc.setQueryData(playlistKeys.sidebarPlaylists(), ctx.previousPlaylists);
      }

      toast.error(err.message);
    },
    onSuccess: (res) => {
      qc.setQueryData<SidebarPlaylist[]>(
        playlistKeys.sidebarPlaylists(),
        (old) => {
          if (!old) return [res];

          const filtered = old.filter((pl) => !pl.id.startsWith("optimistic-"));
          return [res, ...filtered];
        }
      );

      qc.setQueryData<UserPlaylist[]>(playlistKeys.userPlaylists(), (old) => {
        if (!old) return old;

        return [res, ...old];
      });

      onSuccess(res);
      form.reset();
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((values) => mutate(values))}
        className="space-y-6"
      >
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Ex: My favorite songs" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ex: This is my favorite playlist"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-input p-3 shadow-sm bg-input/30">
              <div className="space-y-2">
                <FormLabel>Public</FormLabel>
                <FormDescription>
                  Everyone can see this playlist
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          type="submit"
          disabled={!isValid || isSubmitting || isPending}
        >
          {isPending ? "Creating…" : "Create playlist"}
        </Button>
      </form>
    </Form>
  );
};
