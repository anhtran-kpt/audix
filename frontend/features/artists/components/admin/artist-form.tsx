"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
  ArtistFormInput,
  ArtistFormOutput,
  artistFormSchema,
} from "../../schemas/artist-form.schema";
import { Artist } from "@/features/common/types/entity.type";
import { uploadImage } from "@/features/media/api/client";
import { createArtist, updateArtist } from "../../api/client";
import { sanitizeNull } from "@/features/common/utils/form-helper";

interface ArtistFormProps {
  initialData?: Artist;
}
export function ArtistForm({ initialData }: ArtistFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const isEditMode = !!initialData;

  const action = isEditMode ? "Save Changes" : "Create Artist";
  const loadingAction = isEditMode ? "Saving..." : "Creating...";

  const [step, setStep] = useState(1);
  const [avatarFile, setAvatarFile] = useState<File | string | null>(
    initialData?.avatarId ? initialData.avatarUrl : null
  );
  const [bannerFile, setBannerFile] = useState<File | string | null>(
    initialData?.bannerId ? initialData.bannerUrl : null
  );
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ArtistFormInput>({
    resolver: zodResolver(artistFormSchema) as any,
    defaultValues: initialData
      ? (sanitizeNull(initialData) as ArtistFormInput)
      : {
          name: "",
          bio: "",
        },
  });

  const onSubmit = async (values: ArtistFormOutput) => {
    try {
      setIsUploading(true);

      let finalAvatarId = initialData?.avatarId || null;
      let finalBannerId = initialData?.bannerId || null;

      let finalAvatarColor = initialData?.avatarColor || null;
      let finalBannerColor = initialData?.bannerColor || null;

      const uploadTasks = [];

      if (avatarFile instanceof File) {
        uploadTasks.push(
          uploadImage(avatarFile).then((res) => {
            finalAvatarId = res.publicId;
            finalAvatarColor = res.dominantColor;
          })
        );
      } else if (avatarFile === null) {
        finalAvatarId = null;
        finalAvatarColor = null;
      }

      if (bannerFile instanceof File) {
        uploadTasks.push(
          uploadImage(bannerFile).then((res) => {
            finalBannerId = res.publicId;
            finalBannerColor = res.dominantColor;
          })
        );
      } else if (bannerFile === null) {
        finalBannerId = null;
        finalBannerColor = null;
      }

      await Promise.all(uploadTasks);

      const payload = {
        ...values,
        avatarId: finalAvatarId ?? null,
        bannerId: finalBannerId ?? null,
        avatarColor: finalAvatarColor ?? null,
        bannerColor: finalBannerColor ?? null,
      };

      if (isEditMode) {
        await updateArtist(initialData.id, payload);
        toast.success("Artist updated!");
      } else {
        await createArtist(payload);
        toast.success("Artist created!");
      }

      queryClient.invalidateQueries({ queryKey: ["artists"] });
      router.push("/admin/artists");
    } catch (error) {
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

  return (
    <div className="max-w-2xl mx-auto p-6 border rounded-lg bg-background shadow-sm">
      <div className="flex items-center gap-2 mb-6 text-sm font-medium text-muted-foreground">
        <span className={step === 1 ? "text-primary" : ""}>1. Basic Info</span>
        <span>/</span>
        <span className={step === 2 ? "text-primary" : ""}>2. Media</span>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit as any)}
          className="space-y-6"
        >
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
              <ImageUpload
                label="Avatar (Square)"
                value={avatarFile}
                onChange={setAvatarFile}
                className="aspect-square"
              />

              <ImageUpload
                label="Banner (Wide)"
                value={bannerFile}
                onChange={setBannerFile}
                className="aspect-video col-span-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isUploading}
              >
                Back
              </Button>
            )}

            {step === 1 ? (
              <Button key="next-btn" type="button" onClick={onNext}>
                Next Step
              </Button>
            ) : (
              <Button key="submit-btn" type="submit" disabled={isUploading}>
                {isUploading ? loadingAction : action}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
