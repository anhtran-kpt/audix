import { makeGET } from "@/lib/route-factory";
import { cookies, headers } from "next/headers";
import { randomUUID } from "crypto";
import db from "@/lib/db";

export const GET = makeGET({
  auth: "public",
  handler: async () => {
    const COOKIE = "deviceId";

    const c = await cookies();
    const { get } = await headers();
    let id = c.get(COOKIE)?.value;

    if (!id) {
      id = randomUUID();
      c.set(COOKIE, id, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        secure: true,
      });
    }

    const ua = get("user-agent") ?? null;

    await db.device.upsert({
      where: { id },
      update: { lastSeenAt: new Date() },
      create: { id, userAgent: ua ?? undefined },
    });

    return { deviceId: id };
  },
});
