// Imports
// ============================================================
import React from "react";
import QueryProvider from "./query";
import TRPCReactProvider from "./trpc";
// Root Provider Component
// ============================================================
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <TRPCReactProvider>
        {children}
      </TRPCReactProvider>
    </QueryProvider>
  );
};

// Export
// ============================================================
export default Providers;
