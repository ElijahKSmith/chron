import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import ChronNavbar from "./navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "chron",
  description: "Tracking for video game resets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={inter.className}>
        <Providers>
          <main className="min-h-screen h-auto">
            <ChronNavbar />
            <div className="px-7">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
