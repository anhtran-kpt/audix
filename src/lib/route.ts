import { z, ZodType } from "zod";
import { badRequest, conflict, notFound, serverError } from "./http";
import { parseJson, parseParams, parseQuery } from "./zod-helpers";
import { Prisma } from "@/app/generated/prisma";

type Ctx<P = unknown, Q = unknown, B = unknown> = {
  req: Request;
  params: P;
  query: Q;
  body: B;
};

type Opts<
  P extends ZodType | undefined,
  Q extends ZodType | undefined,
  B extends ZodType | undefined
> = {
  params?: P;
  query?: Q;
  body?: B;
  handler: (
    ctx: Ctx<
      P extends ZodType ? z.infer<P> : unknown,
      Q extends ZodType ? z.infer<Q> : unknown,
      B extends ZodType ? z.infer<B> : unknown
    >
  ) => Promise<Response> | Response;
};

export function defineRoute<
  P extends ZodType | undefined = undefined,
  Q extends ZodType | undefined = undefined,
  B extends ZodType | undefined = undefined
>(opts: Opts<P, Q, B>) {
  return async function route(req: Request, ctx: { params: unknown }) {
    try {
      const params = opts.params
        ? parseParams(ctx.params, opts.params)
        : (undefined as any);
      const query = opts.query
        ? parseQuery(req, opts.query)
        : (undefined as any);
      const body = opts.body
        ? await parseJson(req, opts.body)
        : (undefined as any);
      return await opts.handler({ req, params, query, body });
    } catch (err: any) {
      if (err instanceof Response) return err;
      if (err?.name === "ZodError")
        return badRequest("Validation error", err.flatten?.());
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002")
          return conflict("Unique constraint violation", {
            target: err.meta?.target,
          });
        if (err.code === "P2025") return notFound("Record not found");
      }
      console.error(err);
      return serverError();
    }
  };
}
