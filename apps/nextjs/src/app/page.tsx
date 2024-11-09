// Imports
// ============================================================
import { db } from "@repo/db/client";

// Main Page Component
// ============================================================
const Home = async () => {
  const users = await db.query.users.findMany();
  return (
    <main>
      <h1>NextJS App</h1>
      <p>A monorepo NextJS App with Turbo Repo</p>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </main>
  );
};

// Exports
// ============================================================
export default Home;
