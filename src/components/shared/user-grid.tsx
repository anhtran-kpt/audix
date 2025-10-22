"use client";

import { useRouter } from "next/navigation";
import { GridWrapper } from "./grid-wrapper";
import { NavLink } from "../ui/nav-link";
import { AppImage } from "./app-image";
import { UserItem } from "@/features/user/contracts/user-dto";
import Image from "next/image";

type UserGridProps = {
  users: UserItem[];
};

export default function UserGrid({ users }: UserGridProps) {
  const router = useRouter();

  return (
    <GridWrapper>
      {users.map((user) => (
        <div
          key={user.id}
          className="flex flex-col group gap-2 overflow-hidden"
        >
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
                />
              </div>
            ) : (
              <AppImage
                alt={user.name ?? "profile"}
                src={user.image ?? process.env.NEXT_PUBLIC_FALLBACK_USER_COVER!}
                className="rounded-full group-hover:scale-105 transition-transform duration-300"
                containerClassName="rounded-full aspect-square"
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
      ))}
    </GridWrapper>
  );
}
