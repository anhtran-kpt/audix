import z from "zod";
import { TrackItemSchema } from "./track-schema";

export type TrackItem = z.infer<typeof TrackItemSchema>;
