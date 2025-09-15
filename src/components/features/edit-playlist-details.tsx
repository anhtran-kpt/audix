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
import { playlistDetailOption } from "@/features/playlist/query/playlist-options";
import { zCuidType } from "@/features/shared/contracts/shared-dto";
import { Textarea } from "../ui/textarea";
import { CoverImage } from "../ui/cover-image";
import { FallbackCoverImage } from "./fallback-cover-image";
import { useOptimisticPlaylistUpdate } from "@/hooks/use-optimistic-playlist-update";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdatePlaylistInput,
  UpdatePlaylistInputSchema,
} from "@/features/playlist/contracts/playlist-dto";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useState } from "react";

export default function EditPlaylistDetails({
  playlistId,
}: {
  playlistId: zCuidType;
}) {
  const [open, setOpen] = useState(false);

  const { data: playlist, status } = useQuery({
    ...playlistDetailOption(playlistId),
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
      title: playlist?.title ?? "",
      description: playlist?.description ?? "",
    },
  });

  function onSubmit(input: UpdatePlaylistInput) {
    updatePlaylistInfo(
      { playlistId, input },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      }
    );
  }

  if (status === "pending" || status === "error") {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center"
        >
          <DialogTrigger asChild>
            <IconButton
              icon={EditIcon}
              size="xl"
              tooltipContent={<>Edit details</>}
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] lg:max-w-xl">
            <DialogHeader>
              <DialogTitle>Edit details</DialogTitle>
            </DialogHeader>
            <div className="flex items-stretch gap-4">
              <div className="flex-shrink-0">
                {playlist.imageId ? (
                  <CoverImage
                    alt={playlist.title}
                    src={playlist.imageId}
                    size="xl"
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
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Add a playlist title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <div className="grid gap-3">
                  <Label htmlFor="playlist-title">Title</Label>
                  <Input id="playlist-title" name="title" />
                </div> */}

                <div className="flex flex-col flex-1 gap-3">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add an optional description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    className="h-full resize-none"
                    defaultValue={playlist.description ?? ""}
                    placeholder="Add an optional description"
                  /> */}
                </div>
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
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
