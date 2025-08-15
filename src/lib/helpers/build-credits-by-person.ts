import { ROLE_META } from "../constants/credit-role-meta";
import { TCredit, type TA } from "@/types";
import { norm } from "./norm";

type HeadlineRole = "MAIN_ARTIST" | "FEATURED_ARTIST" | "REMIX_ARTIST";

export type PersonCredits = {
  key: string; // "a:<artistId>" | "n:<normalizedName>"
  artistId: string | null;
  displayName: string;
  artist: { name: string } | null;
  roles: Array<{ label: string; details?: string | null }>;
  _minOrder: number;
  _headlineWeight?: number; // primary/featured/remix ưu tiên
};

// Label + trọng số cho role của TrackArtist (headline)
const ARTIST_ROLE_META: Record<
  HeadlineRole,
  { label: string; weight: number }
> = {
  MAIN_ARTIST: { label: "Main Artist", weight: 0 },
  FEATURED_ARTIST: { label: "Featured Artist", weight: 10 },
  REMIX_ARTIST: { label: "Remix Artist", weight: 20 },
};

export function buildCreditsByPerson(input: {
  artists: TA[];
  credits: TCredit[];
}): PersonCredits[] {
  const people = new Map<string, PersonCredits>();

  const getOrCreate = (
    key: string,
    displayName: string,
    artist: PersonCredits["artist"]
  ) => {
    let p = people.get(key);
    if (!p) {
      p = {
        key,
        artistId: key.startsWith("a:") ? key.slice(2) : null,
        displayName,
        artist,
        roles: [],
        _minOrder: Number.MAX_SAFE_INTEGER,
      };
      people.set(key, p);
    }
    return p;
  };

  // 1) Nạp từ TrackArtist → thêm badge/label headline vào roles
  for (const a of input.artists) {
    const meta = ARTIST_ROLE_META[a.role];
    const key = `a:${a.artistId}`;
    const person = getOrCreate(key, a.artist.name, a.artist);
    person.roles.push({ label: meta.label });
    person._minOrder = Math.min(person._minOrder, a.order);
    person._headlineWeight = Math.min(
      person._headlineWeight ?? Infinity,
      meta.weight
    );
  }

  // 2) Nạp từ TrackCredit → thêm các role chi tiết
  for (const c of input.credits) {
    const m = ROLE_META[c.role] ?? { label: c.role, weight: 999 };
    let label = m.label ?? c.role;

    const key = c.artistId ? `a:${c.artistId}` : `n:${norm(c.name)}`;
    const displayName = c.artist?.name ?? c.name;
    const person = getOrCreate(key, displayName, c.artist ?? null);

    person.roles.push({ label, details: c.details ?? undefined });
    person._minOrder = Math.min(person._minOrder, c.order);

    person._headlineWeight = Math.min(
      person._headlineWeight ?? Infinity,
      (m as any).weight ?? 999
    );
  }

  for (const p of people.values()) {
    const seen = new Set<string>();
    p.roles = p.roles.filter((r) => {
      const k = `${r.label}|${r.details ?? ""}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    p.roles.sort((a, b) => {
      const aw =
        a.label === "Main Artist"
          ? -3
          : a.label === "Featured Artist"
          ? -2
          : a.label === "Remix Artist"
          ? -1
          : Object.values(ROLE_META).find((x) => x.label === a.label)?.weight ??
            999;

      const bw =
        b.label === "Main Artist"
          ? -3
          : b.label === "Featured Artist"
          ? -2
          : b.label === "Remix Artist"
          ? -1
          : Object.values(ROLE_META).find((x) => x.label === b.label)?.weight ??
            999;

      return aw - bw || a.label.localeCompare(b.label);
    });
  }

  return [...people.values()].sort(
    (a, b) =>
      (a._headlineWeight ?? 999) - (b._headlineWeight ?? 999) ||
      a._minOrder - b._minOrder ||
      a.displayName.localeCompare(b.displayName)
  );
}
