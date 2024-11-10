// Imports
// ============================================================
import React from "react";
import Link from 'next/link';
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { validateSessionToken } from "@repo/auth";
import { type User } from "@repo/db/schema";
import { signUp } from "@/actions/auth/signup";
import { Label } from "@repo/ui/label";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";

// Page Component
// ============================================================
export default async function SignUp({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
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
  const handleSubmitSignUp = async (formData: FormData) =>  {
    "use server";
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const result = await signUp({ name, email });
    if (result.success) {
      return redirect("/auth/signup?success=true");
    }
    redirect(`/auth/signup?error=${result.error}`);
  };

  // Render
  return (
    <main className="p-8">
      <h1>Sign Up</h1>
      <p>Sign-up with your email and password. Already have an account? <Link href="/auth/signin">Sign In</Link>.</p>
      <hr />
      <form action={handleSubmitSignUp}>
        <div className="mb-4">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" type="text" required placeholder="John Smith" />
        </div>
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