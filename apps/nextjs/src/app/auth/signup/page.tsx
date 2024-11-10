// Imports
// ============================================================
import React from "react";
import Link from 'next/link';
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { validateSessionToken } from "@repo/auth";
import { type User } from "@repo/db/schema";
import { signUp } from "@/actions/auth/signup";

// Page Component
// ============================================================
export default async function SignUp() {
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
      return redirect("/");
    }
  };

  // Render
  return (
    <main>
      <h1>Sign Up</h1>
      <p>Sign-up with your email and password. Already have an account? <Link href="/auth/signin">Sign In</Link>.</p>
      <hr />
      <form action={handleSubmitSignUp}>
        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" required placeholder="John Smith" />
        </div>
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