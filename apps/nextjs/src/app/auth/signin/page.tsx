// Imports
// ============================================================
import React from "react";
import Link from 'next/link';
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { validateSessionToken } from "@repo/auth";
import { type User } from "@repo/db/schema";
import { signIn } from "@/actions/auth/signin";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";

// Page Component
// ============================================================
export default async function SignIn({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  // Params
  const success = (await searchParams)?.success;
  const error = (await searchParams)?.error;

  // Server Side Requests
  const token = (await cookies()).get("session")?.value;
  let user: User | null = null;
  if (token) {
    user = (await validateSessionToken(token))?.user;
  }

  // Session Handling
  if (user) {
    return redirect("/");
  }

  // Functions
  const handleSubmitSignIn = async (formData: FormData) =>  {
    "use server";
    const email = formData.get("email") as string;
    const result = await signIn({ email });
    if (result.success) {
      return redirect("/auth/signin?success=true");
    }
    redirect(`/auth/signin?error=${result.error}`);
  };

  // Render
  return (
    <main className="p-8">
      <h1>Sign In</h1>
      <p>Sign-in with your email. Don't have an account? <Link href="/auth/signup">Sign Up</Link>.</p>
      <hr />
      <form action={handleSubmitSignIn}>
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="your@email.com" />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Please check your email for a verification link.</p>}
        <div>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </main>
  );
}