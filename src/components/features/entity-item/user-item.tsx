"use client";

import { UserItem as UserItemType } from "@/features/user/contracts/user-dto";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AppImage } from "@/components/shared/app-image";
import { NavLink } from "@/components/ui/nav-link";

export const UserItem = ({ user }: { user: UserItemType }) => {
  const router = useRouter();

  return (
    <div key={user.id} className="flex flex-col group gap-2 overflow-hidden">
      <div
        className="relative cursor-pointer group"
        onClick={() => router.push(`/users/${user.id}`)}
      >
        {user.image && user.image.startsWith("https") ? (
          <div className="rounded-full relative aspect-square overflow-hidden transition-transform duration-300">
            <Image
              alt={user.name ?? "profile"}
              src={user.image}
              className="rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
              fill
              sizes="240px"
            />
          </div>
        ) : (
          <AppImage
            alt={user.name ?? "profile"}
            src={user.image ?? process.env.NEXT_PUBLIC_FALLBACK_USER_COVER!}
            className="rounded-full group-hover:scale-105 transition-transform duration-300"
            containerClassName="rounded-full aspect-square"
            sizes="240px"
          />
        )}
      </div>
      <div className="flex flex-col items-start w-full min-w-0">
        <NavLink
          href={`/users/${user.id}`}
          className="text-[calc(15rem/16)] truncate block w-full"
        >
          {user.name}
        </NavLink>
        <div className="flex text-[calc(13rem/16)] text-muted-foreground items-center gap-1.5 mt-0.5">
          <span>Profile</span>
        </div>
      </div>
    </div>
  );
};
