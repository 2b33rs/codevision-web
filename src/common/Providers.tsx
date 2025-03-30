import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import { ThemeProvider } from "@/components/dark/theme-provider.tsx";
import React from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>{children}</SidebarProvider>
    </ThemeProvider>
  );
};

export default Providers;
