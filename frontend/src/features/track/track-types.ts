import z from "zod";
import { TrackItemSchema } from "./track-schemas";

export type TrackItem = z.infer<typeof TrackItemSchema>;
