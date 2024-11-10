// Imports
// ============================================================
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import RootProvider from "@/providers";

// Fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
};

// Export
// ============================================================
export default RootLayout;
export { metadata };

