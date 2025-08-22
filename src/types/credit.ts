import { CreditRoleKey } from "@/lib/constants/credit-role-meta";

export type TA = {
  role: "MAIN_ARTIST" | "FEATURED_ARTIST" | "REMIX_ARTIST";
  order: number;
  artist: {
    id: string;
    name: string;
  };
};

export type Credit = {
  id: string;
  name: string;
  role: CreditRoleKey;
  details: string | null;
  order: number;
  artist: {
    name: string;
    id: string | null;
  } | null;
};
