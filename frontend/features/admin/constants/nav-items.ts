import {
  LayoutDashboard,
  Music,
  Mic2,
  Users,
  ListMusic,
  Disc,
} from "lucide-react";

export const adminNavItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Artists",
    url: "/admin/artists",
    icon: Mic2,
  },
  {
    title: "Albums",
    url: "/admin/albums",
    icon: Disc,
  },
  {
    title: "Songs",
    url: "/admin/songs",
    icon: Music,
  },
  {
    title: "Genres",
    url: "/admin/genres",
    icon: ListMusic,
  },
];
