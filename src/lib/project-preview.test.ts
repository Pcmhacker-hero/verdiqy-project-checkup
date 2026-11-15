import { describe, expect, it } from "vitest";
import { extractSocialImage, isPublicAddress, publicWebsiteUrl } from "./project-preview.server";

describe("project social images", () => {
  it("uses the website's Open Graph image", () => {
    expect(extractSocialImage('<meta content="https://novixui.com/social.webp" property="og:image">', "https://novixui.com"))
      .toBe("https://novixui.com/social.webp");
  });
  it("resolves relative images and decodes HTML entities", () => {
    expect(extractSocialImage('<meta property="og:image" content="/cover.png?a=1&amp;b=2">', "https://novixui.com"))
      .toBe("https://novixui.com/cover.png?a=1&b=2");
  });
  it("falls back to Twitter images or no image", () => {
    expect(extractSocialImage('<meta name="twitter:image" content="https://novixui.com/twitter.png">', "https://novixui.com"))
      .toBe("https://novixui.com/twitter.png");
    expect(extractSocialImage("<head></head>", "https://novixui.com")).toBeNull();
  });
  it("rejects local addresses and unsafe image schemes", () => {
    for (const url of ["http://localhost", "http://127.0.0.1", "http://[::1]", "https://site.internal", "https://example.com:8080", "javascript:alert(1)"]) {
      expect(() => publicWebsiteUrl(url)).toThrow();
    }
    for (const ip of ["127.0.0.1", "10.0.0.1", "169.254.169.254", "192.168.1.1", "172.16.0.1", "::1", "fc00::1"]) {
      expect(isPublicAddress(ip)).toBe(false);
    }
    expect(isPublicAddress("8.8.8.8")).toBe(true);
    expect(extractSocialImage('<meta property="og:image" content="javascript:alert(1)">', "https://novixui.com")).toBeNull();
  });
});