import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
      </div>
    </div>
  );
}
