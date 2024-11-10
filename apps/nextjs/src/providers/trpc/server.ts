// Imports
// ============================================================
import "server-only";
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";
import { createCaller, type AppRouter } from "@repo/api";
import { createTRPCContext } from "@repo/api/trpc";
import { createQueryClient } from "@/providers/query";

// TRPC Server Configuration
// ============================================================
/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

/**
 * This wraps the `createQueryClient` helper and provides a cached instance of the query client.
 */
const getQueryClient = cache(createQueryClient);

/**
 * This creates a caller for the tRPC API.
 */
const caller = createCaller(createContext);

/**
 * This creates the tRPC API and the HydrateClient component for server-side hydration.
 */
export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient
);
