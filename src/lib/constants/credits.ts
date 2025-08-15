import { CreditRole } from "@/app/generated/prisma";

type CreditGroupId =
  | "PERFORMERS"
  | "WRITERS"
  | "PRODUCTION"
  | "ENGINEERING"
  | "OTHER";

const CREDIT_GROUP_TITLE: Record<CreditGroupId, string> = {
  PERFORMERS: "Performed by",
  WRITERS: "Written by",
  PRODUCTION: "Produced by",
  ENGINEERING: "Engineering",
  OTHER: "Credits",
};

const ROLE_META: Record<
  CreditRole,
  { group: CreditGroupId; weight: number; label?: string }
> = {
  PRIMARY_ARTIST: { group: "PERFORMERS", weight: 0, label: "Primary" },
  FEATURED_ARTIST: { group: "PERFORMERS", weight: 10, label: "Featured" },
  VOCALS: { group: "PERFORMERS", weight: 20, label: "Vocals" },
  RAP: { group: "PERFORMERS", weight: 25, label: "Rap" },
  GUITAR: { group: "PERFORMERS", weight: 30 },
  BASS: { group: "PERFORMERS", weight: 30 },
  DRUMS: { group: "PERFORMERS", weight: 30 },
  PIANO: { group: "PERFORMERS", weight: 30 },

  WRITER: { group: "WRITERS", weight: 0, label: "Writer" },
  LYRICIST: { group: "WRITERS", weight: 5 },
  COMPOSER: { group: "WRITERS", weight: 10 },
  ARRANGER: { group: "WRITERS", weight: 20, label: "Arranger" },

  PRODUCER: { group: "PRODUCTION", weight: 0 },
  CO_PRODUCER: { group: "PRODUCTION", weight: 5 },
  EXECUTIVE_PRODUCER: { group: "PRODUCTION", weight: 10 },

  MIXING_ENGINEER: { group: "ENGINEERING", weight: 0, label: "Mixing" },
  MASTERING_ENGINEER: { group: "ENGINEERING", weight: 5, label: "Mastering" },
  RECORDING_ENGINEER: { group: "ENGINEERING", weight: 10, label: "Recording" },
  ENGINEER: { group: "ENGINEERING", weight: 15 },

  // fallback
  // @ts-ignore
  UNKNOWN: { group: "OTHER", weight: 999 },
};
