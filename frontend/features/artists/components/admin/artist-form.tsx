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
import { useCreateArtist } from "../../hooks/admin/use-create-artist";
import { useUpdateArtist } from "../../hooks/admin/use-update-artist";
import { emptyStringToNull } from "@/features/common/utils/form-helper";
import { compressImage } from "@/features/common/utils/compress-image";
import { uploadMedia } from "@/features/media/api/client";
import { CreateArtistDto, UpdateArtistDto } from "../../artists.type";

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

  const onSubmit = async (values: ArtistFormValues) => {
    try {
      setIsUploading(true);

      const processAndUpload = async (
        file: File | string | null | undefined,
        ctx: string
      ) => {
        if (!(file instanceof File)) return null;

        const compressedFile = await compressImage(file);

        return uploadMedia(compressedFile, "image", "artists", {
          main: values.name,
          ctx: ctx,
        });
      };

      if (!initialData) {
        const [avatarRes, bannerRes] = await Promise.all([
          processAndUpload(values.avatar, "avatar"),
          processAndUpload(values.banner, "banner"),
        ]);

        const payload: CreateArtistDto = {
          name: values.name,
          bio: values.bio,
          avatarId: avatarRes?.publicId || null,
          avatarColor: avatarRes?.dominantColor || null,
          bannerId: bannerRes?.publicId || null,
          bannerColor: bannerRes?.dominantColor || null,
        };

        // 🔥 QUAN TRỌNG: Phải có await
        await createArtist(payload);
        toast.success("Artist created successfully!");
        return;
      }

      const payload: UpdateArtistDto = {};

      if (values.name !== initialData.name) {
        payload.name = values.name;
      }

      const formBio = values.bio?.trim() || null;
      if (formBio !== initialData.bio) {
        payload.bio = formBio;
      }

      const resolveImageChange = async (
        newFile: File | string | null | undefined,
        currentUrl: string | null | undefined,
        ctx: string
      ) => {
        if (newFile instanceof File) {
          return processAndUpload(newFile, ctx);
        }

        if (newFile === null && currentUrl) {
          return null;
        }

        return undefined;
      };

      const [avatarResult, bannerResult] = await Promise.all([
        resolveImageChange(values.avatar, initialData.avatarUrl, "avatar"),
        resolveImageChange(values.banner, initialData.bannerUrl, "banner"),
      ]);

      if (avatarResult !== undefined) {
        payload.avatarId = avatarResult ? avatarResult.publicId : null;
        payload.avatarColor = avatarResult ? avatarResult.dominantColor : null;
      }

      if (bannerResult !== undefined) {
        payload.bannerId = bannerResult ? bannerResult.publicId : null;
        payload.bannerColor = bannerResult ? bannerResult.dominantColor : null;
      }

      if (Object.keys(payload).length === 0) {
        toast.info("No changes to save");
        return;
      }

      await updateArtist({ artistId: initialData.id, values: payload });
      toast.success("Artist updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
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
                    <Input placeholder="Artist name" {...field} />
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
                    <Textarea placeholder="Biography" {...field} />
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
                        className="aspect-square rounded-full w-full"
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
