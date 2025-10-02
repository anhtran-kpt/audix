import {
  CREDIT_GROUP_TITLE,
  ROLE_META,
} from "@/lib/constants/credit-role-meta";
import { Credit, CreditGroupId, type TA } from "@/types/credit";
import { norm } from "@/utils/string";

export type CreditSection = {
  id: CreditGroupId;
  title: string;
  people: Array<{
    key: string; // "a:<id>" | "n:<normalized>"
    artistId: string | null;
    displayName: string;
    artist: { name: string } | null;
    badges?: string[]; // Primary/Featured/Remix from TrackArtist
    roles: Array<{
      label: string;
      details?: string | null;
      order: number;
      weight: number;
    }>;
    minOrder: number;
    weight: number;
  }>;
};

const SECTION_ORDER: CreditGroupId[] = [
  "PERFORMERS",
  "WRITERS",
  "PRODUCTION",
  "ENGINEERING",
  "LEGAL",
  "OTHER",
];
const MAIN_BADGE_WEIGHT = 0,
  FEATURED_BADGE_WEIGHT = 10,
  REMIX_BADGE_WEIGHT = 20;

export function buildCreditSections(input: {
  artists: TA[];
  credits: Credit[];
}): CreditSection[] {
  const sections = SECTION_ORDER.reduce<Record<CreditGroupId, CreditSection>>(
    (acc, id) => {
      acc[id] = {
        id,
        title: CREDIT_GROUP_TITLE[id],
        people: [],
      };
      return acc;
    },
    {} as Record<CreditGroupId, CreditSection>
  );

  console.log(input);

  // Headline "Performed by" from TrackArtist (badges + order/weight)
  for (const a of input.artists) {
    const key = `a:${a.artist.id}`;
    const badge =
      a.role === "MAIN_ARTIST"
        ? "Primary"
        : a.role === "FEATURED_ARTIST"
        ? "Featured"
        : "Remix";
    const weight =
      a.role === "MAIN_ARTIST"
        ? MAIN_BADGE_WEIGHT
        : a.role === "FEATURED_ARTIST"
        ? FEATURED_BADGE_WEIGHT
        : REMIX_BADGE_WEIGHT;

    pushPerson(sections.PERFORMERS, {
      key,
      artistId: a.artist.id,
      displayName: a.artist.name,
      artist: a.artist,
      badges: [badge],
      roles: [],
      minOrder: a.order,
      weight,
    });
  }

  // Credits to section by ROLE_META
  for (const c of input.credits) {
    const meta = ROLE_META[c.role] ?? {
      group: "OTHER" as CreditGroupId,
      weight: 999,
      label: c.role,
    };
    const sec = sections[meta.group];

    const key = c.artist?.id ? `a:${c.artist.id}` : `n:${norm(c.name)}`;
    const displayName = c.artist?.name ?? c.name;
    const person = getOrCreatePerson(sec, {
      key,
      artistId: c.artist?.id ?? null,
      displayName,
      artist: c.artist ?? null,
    });

    person.roles.push({
      label: meta.label ?? c.role,
      details: c.details ?? undefined,
      order: c.order,
      weight: meta.weight,
    });
    person.minOrder = Math.min(person.minOrder, c.order);
    person.weight = Math.min(person.weight, meta.weight);
  }

  // Sort roles by each person and sort person in the section
  for (const sec of Object.values(sections)) {
    for (const p of sec.people) {
      p.roles.sort(
        (a, b) =>
          a.weight - b.weight ||
          a.order - b.order ||
          a.label.localeCompare(b.label)
      );
    }
    sec.people.sort(
      (a, b) =>
        a.weight - b.weight ||
        a.minOrder - b.minOrder ||
        a.displayName.localeCompare(b.displayName)
    );
  }

  return SECTION_ORDER.map((id) => sections[id]).filter(
    (s) => s.people.length > 0
  );
}

function pushPerson(
  sec: CreditSection,
  person: Omit<CreditSection["people"][number], "roles"> & {
    roles?: CreditSection["people"][number]["roles"];
  }
) {
  const i = sec.people.findIndex((p) => p.key === person.key);
  if (i >= 0) {
    const cur = sec.people[i];
    if (person.badges)
      cur.badges = Array.from(
        new Set([...(cur.badges ?? []), ...person.badges])
      );
    cur.minOrder = Math.min(cur.minOrder, person.minOrder);
    cur.weight = Math.min(cur.weight, person.weight);
    return;
  }
  sec.people.push({ ...person, roles: person.roles ?? [] });
}

function getOrCreatePerson(
  sec: CreditSection,
  base: Pick<
    CreditSection["people"][number],
    "key" | "artistId" | "displayName" | "artist"
  >
) {
  let p = sec.people.find((x) => x.key === base.key);
  if (!p) {
    p = {
      ...base,
      roles: [],
      badges: [],
      minOrder: Number.MAX_SAFE_INTEGER,
      weight: Number.MAX_SAFE_INTEGER,
    };
    sec.people.push(p);
  }
  return p;
}
