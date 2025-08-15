import { CreditRoleKey } from "@/lib/constants/credit-role-meta";

export type TA = {
  artistId: string;
  role: "MAIN_ARTIST" | "FEATURED_ARTIST" | "REMIX_ARTIST";
  order: number;
  artist: { name: string };
};

export type TCredit = {
  id: string;
  artistId: string | null;
  name: string;
  role: CreditRoleKey;
  details: string | null;
  order: number;
  artist: { name: string } | null;
};
