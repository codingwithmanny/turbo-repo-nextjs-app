// Imports
// ============================================================
// import { db } from "@repo/db/client";
import { cookies } from "next/headers";
import { validateSessionToken } from "@repo/auth";
import { type User } from "@repo/db/schema";
import Link from "next/link";
import { signOut } from "@/actions/auth/signout";
import { redirect } from "next/navigation";
import { api } from "@/providers/trpc/server";
import { postCreate, postDelete, postUpdate } from "@/actions/posts";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/card";

// Main Page Component
// ============================================================
const Home = async () => {
  // Server Side Requests
  const token = (await cookies()).get("session")?.value;
  let user: User | null = null;
  if (token) {
    user = (await validateSessionToken(token))?.user;
  }

  // Queries
  const posts = await api.posts.list();

  // Functions
  /**
   * Handles the submission of the sign out form.
   * @returns {Promise<void>}
   */
  const handleSubmitSignOut = async () => {
    "use server";
    const result = await signOut();
    if (result.success) {
      return redirect("/");
    }
  };

  // Render
  return (
    <main className="p-8">
      <h1>NextJS App</h1>
      <p>A monorepo NextJS App with Turbo Repo</p>
      <hr />
      {user ? (
        <section>
          <code className="mb-4">
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </code>
          <form action={handleSubmitSignOut}>
            <Button type="submit">Sign Out</Button>
          </form>
          <hr />
          <h2>Posts</h2>
          <h3>Create Posts</h3>
          <form action={postCreate}>
            <div className="flex flex-col gap-2 mb-4">
              <Label htmlFor="title">Title</Label>
              <Input id="title" type="text" name="title" placeholder="Title" />
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <Label htmlFor="content">Content</Label>
              <Input id="content" type="text" name="content" placeholder="Content" />
            </div>
            <Button type="submit">Create</Button>
          </form>
        </section>
      ) : (
        <section>
          <p>
            Please <Link href="/auth/signin">sign in</Link>.
          </p>
          <h2>Posts</h2>
        </section>
      )}
      <h3>List Posts</h3>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{post.content}</CardDescription>
            </CardContent>
            <CardFooter>
            {user && user.id === post.userId ? (
              <>
                <form action={postDelete}>
                  <input type="hidden" name="id" value={post.id} />
                  <Button type="submit" variant="destructive">Delete</Button>
                </form>
              </>
            ) : null}
            </CardFooter>
          </Card>
        ))}
      </div>
      {/* <ul className="posts">
        {posts.map((post) => (
          <li key={post.id}>
            <h4>{post.title}</h4>
            <p>{post.content}</p>
            {user && user.id === post.userId ? (
              <>
                <form action={postDelete}>
                  <input type="hidden" name="id" value={post.id} />
                  <button type="submit">Delete</button>
                </form>
                <hr />
                <form action={postUpdate}>
                  <input type="hidden" name="id" value={post.id} />
                  <div className="flex flex-col gap-2 mb-4">
                    <label htmlFor="title" className="text-sm font-medium">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Title"
                      defaultValue={post.title}
                    />
                  </div>
                  <div className="flex flex-col gap-2 mb-4">
                    <label htmlFor="content" className="text-sm font-medium">
                      Content
                    </label>
                    <input
                      type="text"
                      name="content"
                      placeholder="Content"
                      defaultValue={post.content}
                    />
                  </div>
                  <button type="submit">Update</button>
                </form>
              </>
            ) : null}
          </li>
        ))}
      </ul> */}
      {/* <pre>{JSON.stringify(users, null, 2)}</pre> */}
    </main>
  );
};

// Exports
// ============================================================
export default Home;
