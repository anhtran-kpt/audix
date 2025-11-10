import {
  getHistoryTracks,
  updatePlayHistoryListen,
} from "@/features/playback/playback-actions";
import { makeGET, makePATCH } from "@/lib/route-factory";
import z from "zod";

export const GET = makeGET({
  auth: "required",
  handler: async ({ userId }) => {
    return await getHistoryTracks(userId!);
  },
});

export const PATCH = makePATCH({
  auth: "required",
  body: z.object({ listenedSec: z.number().positive(), historyId: z.string() }),
  handler: async ({ userId, body }) => {
    return await updatePlayHistoryListen({
      userId: userId!,
      historyId: body.historyId,
      listenedSec: body.listenedSec,
    });
  },
});
