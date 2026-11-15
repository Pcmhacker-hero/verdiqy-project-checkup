import { describe, expect, it } from "vitest";
import { rankColor, ratingColor } from "./cf-rating";

describe("Codeforces rating colours", () => {
  it("colours a 2000 rating as candidate master on every page", () => {
    expect(ratingColor(2000)).toBe("text-violet-500");
  });
  it("uses band edges exactly", () => {
    expect(ratingColor(1199)).toBe("text-muted-foreground");
    expect(ratingColor(1200)).toBe("text-emerald-500");
    expect(ratingColor(2100)).toBe("text-orange-500");
    expect(ratingColor(2400)).toBe("text-red-500");
  });
  it("does not mistake candidate master for master when the rating is missing", () => {
    expect(rankColor("candidate master")).toBe("text-violet-500");
    expect(rankColor("master")).toBe("text-orange-500");
  });
});
