"use client";

// Imports
// ============================================================
import { useState } from "react";
import { getQueryClient } from "@/providers/query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import SuperJSON from "superjson";
import { type AppRouter } from "@repo/api";

// TRPC Configuration
// ============================================================
/**
 * This creates the tRPC API for client-side use.
 */
export const api = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

// TRPC Provider Component
// ============================================================
const TRPCReactProvider = ({ children }: { children: React.ReactNode }) => {
  // Get Query Client
  const queryClient = getQueryClient();

  // Create TRPC Client
  const [trpcClient] = useState(() =>
    api.createClient({
      // transformer: SuperJSON,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }),
      ],
    })
  );
  
  // Render
  return <api.Provider client={trpcClient} queryClient={queryClient}>{children}</api.Provider>;
};

// Exports
// ============================================================
export default TRPCReactProvider;
