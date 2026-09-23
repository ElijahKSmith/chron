import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@chron/components/ui/sidebar";
import ChronSidebar from "@chron/components/chron/sidebar";
import { TimerProvider } from "@chron/components/chron/timer-context";
import { SettingsProvider } from "@chron/components/chron/settings-context";

function RootLayout() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SettingsProvider>
        <TimerProvider>
          <SidebarProvider defaultOpen={false}>
            <ChronSidebar />
            <main className="flex w-screen flex-col gap-4 px-5 pt-4 pb-7">
              <Outlet />
            </main>
          </SidebarProvider>
        </TimerProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
