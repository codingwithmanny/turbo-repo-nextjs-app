// Imports
// ============================================================
import type { Metadata } from "next";
import "@repo/ui/globals.css";
import RootProvider from "@/providers";
import { Toaster } from "@repo/ui/components/ui/toaster";

// Metadata
// ============================================================
const metadata: Metadata = {
  title: "Turbo Repo NextJS tRPC",
  description: "A demo app for Turbo Repo",
};

// Layout Component
// ============================================================
const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body>
        <RootProvider>
          {children}
        </RootProvider>
        <Toaster />
      </body>
    </html>
  );
};

// Export
// ============================================================
export default RootLayout;
export { metadata };

