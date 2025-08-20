import { ZodType, ZodError } from "zod";
import { NextResponse } from "next/server";
import { AppError, fail, ok } from "@/lib/errors";
import { getUserIdOrThrow } from "@/lib/auth";

type MaybePromise<T> = T | Promise<T>;
type CtxParams = Record<string, string | string[]>;
type RouteCtx = { params?: MaybePromise<CtxParams> };

type Config<
  P extends ZodType | undefined = undefined,
  Q extends ZodType | undefined = undefined,
  B extends ZodType | undefined = undefined
> = {
  params?: P;
  query?: Q;
  body?: B;
  auth?: "required" | "optional" | "public";
  handler: (ctx: {
    userId?: string;
    params: P extends ZodType ? ReturnType<P["parse"]> : undefined;
    query: Q extends ZodType ? ReturnType<Q["parse"]> : undefined;
    body: B extends ZodType ? ReturnType<B["parse"]> : undefined;
    req: Request;
  }) => Promise<any>;
};

async function run<
  P extends ZodType | undefined,
  Q extends ZodType | undefined,
  B extends ZodType | undefined
>(req: Request, config: Config<P, Q, B>, routeCtx?: RouteCtx) {
  try {
    const url = new URL(req.url);
    const rawQuery = Object.fromEntries(url.searchParams.entries());
    const query: any = config.query ? config.query.parse(rawQuery) : undefined;

    const rawParams = (await Promise.resolve(routeCtx?.params)) ?? {};
    const params: any = config.params
      ? config.params.parse(rawParams)
      : undefined;

    const body: any = config.body
      ? config.body.parse(await req.json())
      : undefined;

    let userId: string | undefined;
    if (config.auth === "required") userId = await getUserIdOrThrow();
    if (config.auth === "optional") {
      try {
        userId = await getUserIdOrThrow();
      } catch {
        userId = undefined;
      }
    }

    const data = await config.handler({ userId, params, query, body, req });
    return NextResponse.json(ok(data));
  } catch (err: any) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        fail("VALIDATION", "Invalid request", err.flatten()),
        { status: 400 }
      );
    }
    if (err instanceof AppError) {
      const status =
        err.code === "UNAUTHORIZED"
          ? 401
          : err.code === "FORBIDDEN"
          ? 403
          : err.code === "NOT_FOUND"
          ? 404
          : err.code === "CONFLICT"
          ? 409
          : err.code === "RATE_LIMIT"
          ? 429
          : 400;
      return NextResponse.json(fail(err.code, err.message, err.details), {
        status,
      });
    }
    console.error(err);
    return NextResponse.json(fail("INTERNAL", "Internal server error"), {
      status: 500,
    });
  }
}

export function makeGET<
  P extends ZodType | undefined,
  Q extends ZodType | undefined
>(config: Config<P, Q, undefined>) {
  return (req: Request, routeCtx?: RouteCtx) => run(req, config, routeCtx);
}
export function makePOST<
  P extends ZodType | undefined,
  B extends ZodType | undefined
>(config: Config<P, undefined, B>) {
  return (req: Request, routeCtx?: RouteCtx) => run(req, config, routeCtx);
}
export function makePATCH<
  P extends ZodType | undefined,
  B extends ZodType | undefined
>(config: Config<P, undefined, B>) {
  return (req: Request, routeCtx?: RouteCtx) => run(req, config, routeCtx);
}
export function makePUT<
  P extends ZodType | undefined,
  B extends ZodType | undefined
>(config: Config<P, undefined, B>) {
  return (req: Request, routeCtx?: RouteCtx) => run(req, config, routeCtx);
}
export function makeDELETE<
  P extends ZodType | undefined,
  Q extends ZodType | undefined
>(config: Config<P, Q, undefined>) {
  return (req: Request, routeCtx?: RouteCtx) => run(req, config, routeCtx);
}
