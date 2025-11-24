"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-load";
import {
  artistFormSchema,
  ArtistFormValues,
} from "../../schemas/artist-form.schema";
import { Artist } from "@/features/common/types/entity.type";
import { uploadImage } from "@/features/media/api/client";
import { useCreateArtist } from "../../hooks/admin/use-create-artist";
import { useUpdateArtist } from "../../hooks/admin/use-update-artist";
import { emptyStringToNull } from "@/features/common/utils/form-helper";
import { compressImage } from "@/features/common/utils/compress-image";

interface ArtistFormProps {
  initialData?: Artist;
}

export function ArtistForm({ initialData }: ArtistFormProps) {
  const { createArtist, isCreating } = useCreateArtist();
  const { updateArtist, isUpdating } = useUpdateArtist();
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);

  const isEditMode = !!initialData;

  const action = isEditMode ? "Save Changes" : "Create Artist";
  const loadingAction = isEditMode ? "Saving..." : "Creating...";

  const form = useForm<ArtistFormValues>({
    resolver: zodResolver(artistFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      bio: initialData?.bio || "",
      avatar: initialData?.avatarUrl || null,
      banner: initialData?.bannerUrl || null,
    },
  });

  const handleUpload = async (fileOrUrl: File | string | null) => {
    if (fileOrUrl instanceof File) {
      const compressedFile = await compressImage(fileOrUrl);

      const res = await uploadImage(compressedFile);
      return { id: res.publicId, color: res.dominantColor };
    }
    return null;
  };

  const onSubmit = async (values: ArtistFormValues) => {
    try {
      setIsUploading(true);

      if (!initialData) {
        const uploadPromises = [];
        type ImageRes = {
          id: string;
          color: string | null;
        } | null;

        let avatarRes = null;
        let bannerRes = null;

        if (values.avatar instanceof File) {
          uploadPromises.push(
            handleUpload(values.avatar).then((res) => (avatarRes = res))
          );
        }
        if (values.banner instanceof File) {
          uploadPromises.push(
            handleUpload(values.banner).then((res) => (bannerRes = res))
          );
        }
        await Promise.all(uploadPromises);

        const payload = {
          name: values.name,
          bio: values.bio,
          avatarId: (avatarRes as ImageRes)?.id ?? null,
          avatarColor: (avatarRes as ImageRes)?.color ?? null,
          bannerId: (bannerRes as ImageRes)?.id ?? null,
          bannerColor: (bannerRes as ImageRes)?.color ?? null,
        };

        createArtist(payload);
        return;
      }

      const payload: any = {};

      if (values.name !== initialData.name) {
        payload.name = values.name;
      }

      const currentBio = emptyStringToNull(values.bio);

      if (currentBio !== initialData.bio) {
        payload.bio = currentBio;
      }

      const tasks = [];

      if (values.avatar instanceof File) {
        tasks.push(
          handleUpload(values.avatar).then((res) => {
            payload.avatarId = res?.id;
            payload.avatarColor = res?.color;
          })
        );
      } else if (values.avatar === null && initialData.avatarUrl) {
        payload.avatarId = null;
        payload.avatarColor = null;
      }

      if (values.banner instanceof File) {
        tasks.push(
          handleUpload(values.banner).then((res) => {
            payload.bannerId = res?.id;
            payload.bannerColor = res?.color;
          })
        );
      } else if (values.banner === null && initialData.bannerUrl) {
        payload.bannerId = null;
        payload.bannerColor = null;
      }

      await Promise.all(tasks);

      if (Object.keys(payload).length === 0) {
        toast.info("No changes to save");
        return;
      }

      updateArtist({ artistId: initialData.id, values: payload });
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const onNext = async (e: React.MouseEvent) => {
    e.preventDefault();

    const isValid = await form.trigger(["name", "bio"]);
    if (isValid) setStep(2);
  };

  const isLoading = isUploading || isCreating || isUpdating;

  return (
    <div className="max-w-2xl mx-auto p-6 border rounded-lg bg-background shadow-sm">
      <div className="flex items-center gap-2 mb-6 text-sm font-medium text-muted-foreground">
        <span className={step === 1 ? "text-primary" : ""}>1. Basic Info</span>
        <span>/</span>
        <span className={step === 2 ? "text-primary" : ""}>2. Media</span>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className={step === 1 ? "block" : "hidden"}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Artist Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Biography</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Bio..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className={step === 2 ? "space-y-6 block" : "hidden"}>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        label="Avatar (Square)"
                        value={value}
                        onChange={onChange}
                        className="aspect-square w-full"
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="banner"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <ImageUpload
                        label="Banner (Wide)"
                        value={value}
                        onChange={onChange}
                        className="w-full"
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isLoading}
              >
                Back
              </Button>
            )}

            {step === 1 ? (
              <Button key="next-btn" type="button" onClick={onNext}>
                Next Step
              </Button>
            ) : (
              <Button key="submit-btn" type="submit" disabled={isLoading}>
                {isLoading ? loadingAction : action}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
