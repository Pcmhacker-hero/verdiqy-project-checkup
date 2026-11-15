import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminGate } from "@/components/app/admin-gate";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminGate>
      <Outlet />
    </AdminGate>
  );
}
