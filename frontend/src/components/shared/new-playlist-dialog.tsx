"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useCreatePlaylist } from "@/features/playlist/hooks/use-create-playlist";
import { useNewPlaylistDialog } from "@/stores/use-new-playlist-dialog";

export function NewPlaylistDialog() {
  const { open, setOpen, closeDialog } = useNewPlaylistDialog();
  const { form, mutation } = useCreatePlaylist(() => {
    closeDialog();
  });

  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = form;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Create new playlist</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
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
                      value={field.value ?? ""}
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
              disabled={!isValid || isSubmitting || mutation.isPending}
            >
              {mutation.isPending ? "Creating…" : "Create playlist"}
            </Button>
          </form>
        </Form>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
