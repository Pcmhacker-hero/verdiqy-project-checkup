import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AdminStatus } from "@/hooks/use-is-admin";

let status: AdminStatus = "pending";
vi.mock("@/hooks/use-is-admin", () => ({ useAdminStatus: () => status }));
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }: { children: ReactNode }) => <a href="/">{children}</a>,
}));

const { AdminGate } = await import("./admin-gate");

afterEach(cleanup);

describe("admin-only pages", () => {
  it("never shows admin content or a denial while the role check is pending", () => {
    status = "pending";
    render(<AdminGate><p>Secret tools</p></AdminGate>);
    expect(screen.queryByText("Secret tools")).toBeNull();
    expect(screen.queryByText("Admins only")).toBeNull();
  });

  it("blocks regular members", () => {
    status = "member";
    render(<AdminGate><p>Secret tools</p></AdminGate>);
    expect(screen.queryByText("Secret tools")).toBeNull();
    expect(screen.getByText("Admins only")).toBeTruthy();
  });

  it("shows the page to admins", () => {
    status = "admin";
    render(<AdminGate><p>Secret tools</p></AdminGate>);
    expect(screen.getByText("Secret tools")).toBeTruthy();
  });
});
