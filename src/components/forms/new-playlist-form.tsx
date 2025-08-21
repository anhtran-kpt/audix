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
import { useMutation } from "@tanstack/react-query";
import { postApi } from "@/lib/http/request";
import {
  CreatePlaylistInput,
  CreatePlaylistInputSchema,
  CreatePlaylistOutput,
} from "@/contracts/playlist";
import { useRouter } from "next/navigation";

export const NewPlaylistForm = ({
  onSuccess,
}: {
  onSuccess: (res: CreatePlaylistOutput) => void;
}) => {
  const router = useRouter();

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

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreatePlaylistInput) =>
      postApi<CreatePlaylistOutput>("/playlists", data),
    onSuccess: (res) => {
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
