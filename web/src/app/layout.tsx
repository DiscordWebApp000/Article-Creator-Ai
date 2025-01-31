import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Makale Üretici",
  description: "AI destekli profesyonel makale üretim platformu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <main className={`${inter.className} relative flex min-h-screen flex-col bg-background antialiased`}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
