"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconButton } from "../ui/icon-button";
import { User2Icon } from "lucide-react";
import { AvatarImage, Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Google from "../ui/google";
import { useTheme } from "next-themes";

export const UserProfile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setTheme, theme } = useTheme();

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
        <Avatar className="size-9">
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
                } text-[calc(8rem/16)] px-1 rounded-sm`}
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
            router.push("/me");
          }}
        >
          Profile
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Themes</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuCheckboxItem
                checked={theme === "light"}
                onCheckedChange={() => setTheme("light")}
              >
                Light
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={theme === "dark"}
                onCheckedChange={() => setTheme("dark")}
              >
                Dark
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={theme === "system"}
                onCheckedChange={() => setTheme("system")}
              >
                System
              </DropdownMenuCheckboxItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/auth/sign-in" })}
        >
          Sign out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
