import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import ClientProviders from "./client-providers";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OrbFi - Autonomous Trading Bots",
  description:
    "Create and manage autonomous trading agents with natural language",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={plusJakarta.className}>
        <ClientProviders>
          {children}
          <Toaster position="top-right" />
        </ClientProviders>
      </body>
    </html>
  );
}
