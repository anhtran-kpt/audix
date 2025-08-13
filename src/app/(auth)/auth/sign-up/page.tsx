import { SignUpForm } from "@/components/features/sign-up-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function SignUpPage() {
  return (
    <Card>
      <CardHeader>Sign up</CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
    </Card>
  );
}
