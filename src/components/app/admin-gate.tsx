import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminStatus } from "@/hooks/use-is-admin";

/** Renders children only for admins; shows a neutral check state while pending. */
export function AdminGate({ children }: { children: ReactNode }) {
  const status = useAdminStatus();

  if (status === "pending") {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">
        Checking access…
      </div>
    );
  }

  if (status !== "admin") {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6 text-foreground">
        <div className="max-w-md space-y-4 text-center">
          <ShieldAlert className="mx-auto size-8 text-muted-foreground" />
          <h1 className="text-2xl font-semibold tracking-tight">Admins only</h1>
          <p className="text-sm text-muted-foreground">This page is restricted to workspace admins.</p>
          <Button asChild size="sm">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
