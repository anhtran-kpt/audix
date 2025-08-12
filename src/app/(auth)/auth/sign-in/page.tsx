import { SignInForm } from "@/components/features/sign-in-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function SignInPage() {
  return (
    <Card>
      <CardHeader>Sign in</CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
    </Card>
  );
}
