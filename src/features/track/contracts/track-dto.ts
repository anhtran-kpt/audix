import z from "zod";
import { TrackListItemSchema } from "./track-schema";

export type TrackListItem = z.infer<typeof TrackListItemSchema>;
