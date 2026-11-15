import { describe, expect, it } from "vitest";
import { normalizeProjectLink } from "./project-link";

describe("project links", () => {
  it("accepts a GitHub repository link", () => {
    expect(normalizeProjectLink("https://github.com/Pcmhacker-hero/verdiqy/"))
      .toBe("https://github.com/Pcmhacker-hero/verdiqy/");
  });
  it("accepts a live project link without a scheme", () => {
    expect(normalizeProjectLink("novixui.com")).toBe("https://novixui.com/");
  });
  it("allows either optional link to remain empty", () => {
    expect(normalizeProjectLink(" ")).toBe("");
  });
  it("rejects executable and malformed links", () => {
    expect(() => normalizeProjectLink("javascript:alert(1)")).toThrow();
    expect(() => normalizeProjectLink("not a link")).toThrow();
  });
});