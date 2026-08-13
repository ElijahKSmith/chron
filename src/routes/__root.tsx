import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { SidebarProvider, SidebarTrigger } from "@chron/components/ui/sidebar";
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
            <main className="w-screen p-2">
              <div className="flex flex-col gap-2">
                <SidebarTrigger />
                <Outlet />
              </div>
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
