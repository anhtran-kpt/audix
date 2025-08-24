import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import db from "@/lib/db";

const COOKIE_NAME = "deviceId";

export const ensureDevice = async () => {
  const c = await cookies();
  let id = c.get(COOKIE_NAME)?.value;
  if (!id) {
    id = randomUUID();
    c.set(COOKIE_NAME, id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 ngày
    });
  }

  await db.device.upsert({
    where: { id },
    update: { lastSeenAt: new Date() },
    create: { id },
  });
  return id;
};
