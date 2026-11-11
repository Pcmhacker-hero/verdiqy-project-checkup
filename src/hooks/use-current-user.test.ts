import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  maybeSingle: vi.fn(),
  callback: undefined as undefined | ((event: string, session: unknown) => void),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: mocks.getSession,
      onAuthStateChange: (callback: typeof mocks.callback) => {
        mocks.callback = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      },
    },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: mocks.maybeSingle }) }) }),
  },
}));

import { useCurrentUser } from "./use-current-user";

const user = { id: "account-a", email: "account@example.test", user_metadata: { display_name: "Prakash Meena" } };

describe("immediate account display", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.callback = undefined;
    mocks.getSession.mockResolvedValue({ data: { session: { user } } });
    mocks.maybeSingle.mockImplementation(() => new Promise(() => {}));
  });

  it("shows the signed-in account before the profile request finishes", async () => {
    const { result } = renderHook(() => useCurrentUser());
    await waitFor(() => expect(result.current?.name).toBe("Prakash Meena"));
    expect(result.current?.email).toBe("account@example.test");
    await waitFor(() => expect(mocks.maybeSingle).toHaveBeenCalled());
    expect(result.current?.initials).toBe("PM");
  });

  it("uses the sign-in event immediately without waiting for session retrieval", () => {
    mocks.getSession.mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => useCurrentUser());
    act(() => mocks.callback?.("SIGNED_IN", { user }));
    expect(result.current?.name).toBe("Prakash Meena");
  });

  it("does not restore the account from a late profile response after sign-out", async () => {
    let resolveProfile: ((value: unknown) => void) | undefined;
    mocks.maybeSingle.mockImplementation(() => new Promise((resolve) => { resolveProfile = resolve; }));
    const { result } = renderHook(() => useCurrentUser());
    await waitFor(() => expect(mocks.maybeSingle).toHaveBeenCalled());
    act(() => mocks.callback?.("SIGNED_OUT", null));
    await act(async () => { resolveProfile?.({ data: { display_name: "Old profile" } }); });
    expect(result.current).toBeNull();
  });
});