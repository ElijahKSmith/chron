import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { SidebarProvider, SidebarTrigger } from "@chron/components/ui/sidebar";
import ChronSidebar from "@chron/components/chron/sidebar";
import { TimerProvider } from "@chron/components/chron/timer-context";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TimerProvider>
            <SidebarProvider defaultOpen={false}>
              <ChronSidebar />
              <main className="w-screen p-2">
                <div className="flex flex-col gap-2">
                  <SidebarTrigger />
                  {children}
                </div>
              </main>
            </SidebarProvider>
          </TimerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
