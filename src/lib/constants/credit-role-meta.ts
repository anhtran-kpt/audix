export type CreditGroupId =
  | "PERFORMERS"
  | "WRITERS"
  | "PRODUCTION"
  | "ENGINEERING"
  | "LEGAL"
  | "OTHER";

export const CREDIT_GROUP_TITLE: Record<CreditGroupId, string> = {
  PERFORMERS: "Performed by",
  WRITERS: "Written by",
  PRODUCTION: "Produced by",
  ENGINEERING: "Engineering",
  LEGAL: "Business / Legal",
  OTHER: "Credits",
};

export const ROLE_META = {
  LEAD_VOCALS: { group: "PERFORMERS", weight: 0, label: "Lead vocals" },
  BACKING_VOCALS: { group: "PERFORMERS", weight: 10, label: "Backing vocals" },
  RAP: { group: "PERFORMERS", weight: 12, label: "Rap" },
  GUITAR: { group: "PERFORMERS", weight: 30, label: "Guitar" },
  BASS: { group: "PERFORMERS", weight: 30, label: "Bass" },
  DRUMS: { group: "PERFORMERS", weight: 30, label: "Drums" },
  PIANO: { group: "PERFORMERS", weight: 30, label: "Piano" },
  KEYBOARD: { group: "PERFORMERS", weight: 30, label: "Keyboard" },
  VIOLIN: { group: "PERFORMERS", weight: 35, label: "Violin" },
  SAXOPHONE: { group: "PERFORMERS", weight: 35, label: "Saxophone" },
  TRUMPET: { group: "PERFORMERS", weight: 35, label: "Trumpet" },
  OTHER_INSTRUMENT: { group: "PERFORMERS", weight: 40, label: "Instrument" },

  // Writers
  SONGWRITER: { group: "WRITERS", weight: 0, label: "Songwriter" },
  COMPOSER: { group: "WRITERS", weight: 5, label: "Composer" },
  LYRICIST: { group: "WRITERS", weight: 5, label: "Lyricist" },
  ARRANGER: { group: "WRITERS", weight: 20, label: "Arranger" },

  // Production
  PRODUCER: { group: "PRODUCTION", weight: 0, label: "Producer" },
  CO_PRODUCER: { group: "PRODUCTION", weight: 5, label: "Co-producer" },
  EXECUTIVE_PRODUCER: {
    group: "PRODUCTION",
    weight: 8,
    label: "Executive producer",
  },
  VOCAL_PRODUCER: { group: "PRODUCTION", weight: 10, label: "Vocal producer" },
  ADDITIONAL_PRODUCTION: {
    group: "PRODUCTION",
    weight: 20,
    label: "Additional production",
  },

  // Engineering
  MIXING_ENGINEER: { group: "ENGINEERING", weight: 0, label: "Mixing" },
  MASTERING_ENGINEER: { group: "ENGINEERING", weight: 5, label: "Mastering" },
  RECORDING_ENGINEER: { group: "ENGINEERING", weight: 10, label: "Recording" },
  ASSISTANT_ENGINEER: {
    group: "ENGINEERING",
    weight: 15,
    label: "Assistant engineer",
  },
  PROGRAMMER: { group: "ENGINEERING", weight: 18, label: "Programmer" },

  // Legal / Business
  PUBLISHER: { group: "LEGAL", weight: 0, label: "Publisher" },
  RECORD_LABEL: { group: "LEGAL", weight: 5, label: "Record label" },
  MANAGEMENT: { group: "LEGAL", weight: 10, label: "Management" },
} as const;

export type CreditRoleKey = keyof typeof ROLE_META;
