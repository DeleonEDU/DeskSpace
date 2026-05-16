import type { ReactNode } from "react";
import { TopBar } from "@/components/booking/TopBar";

type Props = {
  children: ReactNode;
  maxWidth?: "booking" | "profile" | "auth";
  showNav?: boolean;
};

const widths = {
  booking: "max-w-[1360px]",
  profile: "max-w-[1100px]",
  auth: "max-w-lg",
} as const;

export function PageShell({ children, maxWidth = "booking", showNav = true }: Props) {
  return (
    <main className="min-h-screen px-4 py-6 lg:px-8 lg:py-8">
      <div className={`mx-auto flex flex-col gap-6 ${widths[maxWidth]}`}>
        {showNav && <TopBar />}
        {children}
      </div>
    </main>
  );
}
