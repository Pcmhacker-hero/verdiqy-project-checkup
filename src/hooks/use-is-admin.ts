import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** "pending" until the role check finishes, so admin screens never flash a denial. */
export type AdminStatus = "pending" | "admin" | "member";

/**
 * Display-only admin check against `user_roles` via the security-definer
 * `has_role` RPC. Server functions must still verify the role themselves.
 */
export function useAdminStatus(): AdminStatus {
  const [status, setStatus] = useState<AdminStatus>("pending");

  useEffect(() => {
    let cancelled = false;
    let revision = 0;

    async function check() {
      const current = ++revision;
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) {
        if (!cancelled && current === revision) setStatus("member");
        return;
      }
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: uid,
        _role: "admin",
      });
      if (!cancelled && current === revision) {
        setStatus(!error && data === true ? "admin" : "member");
      }
    }

    void check();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        // Defer so the auth callback never awaits Supabase calls itself.
        setTimeout(() => void check(), 0);
      }
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return status;
}

export function useIsAdmin(): boolean {
  return useAdminStatus() === "admin";
}
