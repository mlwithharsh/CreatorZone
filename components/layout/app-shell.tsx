import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
