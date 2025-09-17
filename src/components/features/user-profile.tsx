"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconButton } from "../ui/icon-button";
import { User2Icon } from "lucide-react";
import { AvatarImage, Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Google from "../ui/google";

export const UserProfile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <div>Loading...</div>;

  if (!session)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton icon={User2Icon} tooltipContent="Profile" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Button
                className="w-full"
                onClick={() => signIn("google")}
                variant="outline"
              >
                <Google />
                Sign in with Google
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

  const { image: imageUrl, name, email, subscription } = session.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={imageUrl as string} />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel asChild>
          <div>
            <div className="flex items-center gap-2">
              <span>{name}</span>
              <Badge
                className={`${
                  subscription === "FREE" ? "bg-zinc-500" : "bg-amber-500"
                } text-8 px-1 rounded-sm`}
              >
                {subscription}
              </Badge>
            </div>
            {email && <p className="text-xs text-muted-foreground">{email}</p>}
            <Button className="bg-amber-500 hover:bg-amber-600 mt-3 w-full">
              Upgrade to Premium
            </Button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            router.push("/profile");
          }}
        >
          Profile
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>
          Sign out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
