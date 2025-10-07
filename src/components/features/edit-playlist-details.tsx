"use client";

import { EditIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { IconButton } from "../ui/icon-button";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { Textarea } from "../ui/textarea";
import { FallbackCoverImage } from "./fallback-cover-image";
import { useOptimisticPlaylistUpdate } from "@/features/playlist/hooks/use-optimistic-playlist-update";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdatePlaylistInput } from "@/features/playlist/contracts/playlist-dto";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useEffect, useState } from "react";
import { UpdatePlaylistInputSchema } from "@/features/playlist/contracts/playlist-schema";
import { AppImage } from "../shared/app-image";
import { playlistQueryOptions } from "@/features/playlist/api/playlist-query-options";

export default function EditPlaylistDetails({
  playlistId,
}: {
  playlistId: string;
}) {
  const [open, setOpen] = useState(false);

  const { data: playlist, status } = useQuery({
    ...playlistQueryOptions.banner(playlistId),
    select: (data) => ({
      imageId: data.imageId,
      title: data.title,
      description: data.description,
    }),
  });

  const { mutate: updatePlaylistInfo, isPending } =
    useOptimisticPlaylistUpdate();

  const form = useForm<UpdatePlaylistInput>({
    resolver: zodResolver(UpdatePlaylistInputSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (playlist) {
      form.reset({
        title: playlist.title ?? "",
        description: playlist.description ?? "",
      });
    }
  }, [playlist, form]);

  const onSubmit = (input: UpdatePlaylistInput) => {
    updatePlaylistInfo(
      { playlistId, input },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      }
    );
  };

  if (status === "pending" || status === "error") {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <IconButton
          icon={EditIcon}
          size="xl"
          tooltipContent={<>Edit details</>}
        />
      </DialogTrigger>

      <DialogContent className="lg:max-w-xl" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Edit details</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="flex items-stretch gap-4">
              <div className="flex-shrink-0">
                {playlist.imageId ? (
                  <AppImage
                    alt={playlist.title}
                    src={playlist.imageId}
                    sizes="224px"
                    containerClassName="size-56"
                  />
                ) : (
                  <FallbackCoverImage type="detail" />
                )}
              </div>

              <div className="flex flex-col grow gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Add a playlist title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel>Description</FormLabel>
                      <FormControl className="flex-1 flex">
                        <Textarea
                          className="flex-1 resize-none"
                          placeholder="Add an optional description"
                          value={field.value ?? ""}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
