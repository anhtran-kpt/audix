import { SignUpInputSchema } from "@/features/auth/contracts/auth-schema";
import { signUp } from "@/features/auth/data-access/auth-repo";
import { makePOST } from "@/lib/route-factory";

export const POST = makePOST({
  auth: "public",
  body: SignUpInputSchema,
  handler: async ({ body }) => {
    return signUp(body);
  },
});
