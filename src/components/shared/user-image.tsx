import { Avatar, AvatarImage } from "../ui/avatar";
import { AppImage } from "./app-image";

type UserImageProps = {
  imageUrl?: string | null;
  name?: string | null;
};

export const UserImage = ({ imageUrl, name }: UserImageProps) => {
  if (imageUrl) {
    return (
      <Avatar className="size-9">
        <AvatarImage src={imageUrl} />
      </Avatar>
    );
  }

  return (
    <AppImage
      alt={name ?? "user"}
      src={process.env.NEXT_PUBLIC_FALLBACK_USER_COVER!}
      sizes="36px"
      containerClassName="size-9 aspect-square rounded-full"
    />
  );
};
