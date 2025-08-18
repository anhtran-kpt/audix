import { NextResponse } from "next/server";
import { getUserIdOrThrow } from "../auth";

type SchemaLike<T> = { parse: (i: unknown) => T };
type Infer<S> = S extends SchemaLike<infer T> ? T : never;

type Config<
  QS extends SchemaLike<any> | undefined = undefined,
  BS extends SchemaLike<any> | undefined = undefined
> = {
  query?: QS;
  body?: BS;
  auth?: "required" | "optional" | "public";
  handler: (ctx: {
    req: Request;
    userId?: string;
    query: QS extends SchemaLike<any> ? Infer<QS> : undefined;
    body: BS extends SchemaLike<any> ? Infer<BS> : undefined;
  }) => Promise<any>;
};

export function makeGET<QS extends SchemaLike<any> | undefined = undefined>(
  cfg: Config<QS, undefined>
) {
  return async (req: Request) => {
    try {
      const url = new URL(req.url);
      const raw = Object.fromEntries(url.searchParams);
      const q = cfg.query ? cfg.query.parse(raw) : undefined;

      const userId =
        cfg.auth === "required"
          ? await getUserIdOrThrow()
          : cfg.auth === "optional"
          ? await getUserIdOrThrow().catch(() => undefined)
          : undefined;

      const data = await cfg.handler({
        req,
        userId,
        query: q as any,
        body: undefined,
      });
      return NextResponse.json(data);
    } catch (e: any) {
      if (e?.message === "UNAUTHORIZED")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      if (e?.name === "ZodError")
        return NextResponse.json(
          { error: "Invalid input", issues: e.issues },
          { status: 400 }
        );
      console.error(e);
      return NextResponse.json({ error: "Internal" }, { status: 500 });
    }
  };
}

export function makePOST<BS extends SchemaLike<any> | undefined = undefined>(
  cfg: Config<undefined, BS>
) {
  return async (req: Request) => {
    try {
      const json = await req.json().catch(() => ({}));
      const b = cfg.body ? cfg.body.parse(json) : undefined;

      const userId =
        cfg.auth === "required"
          ? await getUserIdOrThrow()
          : cfg.auth === "optional"
          ? await getUserIdOrThrow().catch(() => undefined)
          : undefined;

      const data = await cfg.handler({
        req,
        userId,
        body: b as any,
        query: undefined,
      });
      return NextResponse.json(data);
    } catch (e: any) {
      if (e?.message === "UNAUTHORIZED")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      if (e?.name === "ZodError")
        return NextResponse.json(
          { error: "Invalid input", issues: e.issues },
          { status: 400 }
        );
      console.error(e);
      return NextResponse.json({ error: "Internal" }, { status: 500 });
    }
  };
}
