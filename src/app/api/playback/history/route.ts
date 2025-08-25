import {
  HistoryEventSchema,
  RecordPlayInputSchema,
} from "@/contracts/playback";
import { makePOST } from "@/server/api/route-factory";
import { recordPlay } from "@/server/modules/playback/services";
import { object } from "zod";

export const POST = makePOST({
  auth: "public",
  body: RecordPlayInputSchema,
  handler: async ({ body }) => {
    return await recordPlay(body);
  },
});
