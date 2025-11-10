import { signUp } from "@/features/auth/auth-actions";
import { SignUpInputSchema } from "@/features/auth/auth-schemas";
import { makePOST } from "@/lib/route-factory";

export const POST = makePOST({
  auth: "public",
  body: SignUpInputSchema,
  handler: async ({ body }) => {
    return signUp(body);
  },
});
