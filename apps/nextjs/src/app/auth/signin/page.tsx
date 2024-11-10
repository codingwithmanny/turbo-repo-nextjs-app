// Imports
// ============================================================
import React from "react";
import Link from 'next/link';
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { validateSessionToken } from "@repo/auth";
import { type User } from "@repo/db/schema";
import { signIn } from "@/actions/auth/signin";

// Page Component
// ============================================================
export default async function SignIn() {
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
      return redirect("/");
    }
  };

  // Render
  return (
    <main>
      <h1>Sign In</h1>
      <p>Sign-in with your email. Don't have an account? <Link href="/auth/signup">Sign Up</Link>.</p>
      <hr />
      <form action={handleSubmitSignIn}>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required placeholder="your@email.com" />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </main>
  );
}