"use client";

import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function ChronNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function closeSplash() {
    const invoke = (await import("@tauri-apps/api/tauri")).invoke;
    invoke("close_splashscreen");
  }

  useEffect(() => {
    closeSplash();
  }, []);

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} maxWidth="full">
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>
      <NavbarContent justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit">chron</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end"></NavbarContent>
      <NavbarMenu>
        <NavbarMenuItem>
          <Link color="foreground" className="w-full" href="/timers" size="lg">
            Timers
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            color="foreground"
            className="w-full"
            href="/settings"
            size="lg"
          >
            Settings
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
