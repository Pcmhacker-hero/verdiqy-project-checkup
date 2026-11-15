/** Accept web links only, adding HTTPS when the scheme is omitted. */
export function normalizeProjectLink(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const candidate = /^[a-z][a-z\d+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const url = new URL(candidate);
  if (!["http:", "https:"].includes(url.protocol) || !url.hostname || url.username || url.password) {
    throw new Error("Please enter a valid HTTP or HTTPS link");
  }
  return url.href;
}