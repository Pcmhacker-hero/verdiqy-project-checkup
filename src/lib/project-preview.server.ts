import { parse, type DefaultTreeAdapterMap } from "parse5";

export function isPublicAddress(address: string): boolean {
  if (address.includes(":")) {
    return /^[23][0-9a-f]{3}:/i.test(address) && !/^2001:(db8|0|10|20):/i.test(address) && !/^2002:/i.test(address);
  }
  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => !Number.isInteger(p) || p < 0 || p > 255)) return false;
  const [a, b] = parts;
  return a !== 0 && a !== 10 && a !== 127 && a < 224 &&
    !(a === 169 && b === 254) && !(a === 172 && b >= 16 && b <= 31) &&
    !(a === 192 && (b === 168 || b === 0 || b === 2)) &&
    !(a === 100 && b >= 64 && b <= 127) &&
    !(a === 198 && (b === 18 || b === 19 || b === 51)) && !(a === 203 && b === 0);
}

export function publicWebsiteUrl(value: string): URL {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.port ||
      !url.hostname.includes(".") || url.hostname.endsWith(".") ||
      /(?:^|\.)(localhost|local|internal|test|invalid)$/.test(url.hostname) ||
      url.hostname.includes(":") || /^\d[\d.]*$/.test(url.hostname)) {
    throw new Error("A public website URL is required");
  }
  return url;
}

async function validateDestination(url: URL, signal: AbortSignal) {
  const answers = await Promise.all(["A", "AAAA"].map(async (type) => {
    const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(url.hostname)}&type=${type}`, {
      headers: { Accept: "application/dns-json" }, signal,
    });
    if (!response.ok) throw new Error("Unable to verify website address");
    const result = await response.json() as { Status: number; Answer?: { type: number; data: string }[] };
    if (result.Status !== 0) throw new Error("Unable to verify website address");
    return (result.Answer ?? []).filter((a) => a.type === 1 || a.type === 28).map((a) => a.data);
  }));
  const addresses = answers.flat();
  if (!addresses.length || !addresses.every(isPublicAddress)) throw new Error("Private website addresses are not allowed");
}

export function extractSocialImage(html: string, baseUrl: string): string | null {
  const root = parse(html);
  const images = new Map<string, string>();
  function visit(node: DefaultTreeAdapterMap["node"]) {
    if ("tagName" in node && node.tagName === "meta") {
      const attrs = Object.fromEntries(node.attrs.map((a) => [a.name, a.value]));
      const key = (attrs.property ?? attrs.name ?? "").toLowerCase();
      if (attrs.content && !images.has(key)) images.set(key, attrs.content);
    }
    if ("childNodes" in node) node.childNodes.forEach(visit);
  }
  visit(root);
  for (const key of ["og:image:secure_url", "og:image", "twitter:image", "twitter:image:src"]) {
    const value = images.get(key);
    if (!value) continue;
    try { return publicWebsiteUrl(new URL(value, baseUrl).href).href; } catch { /* try next image */ }
  }
  return null;
}

export async function fetchProjectPreview(website: string): Promise<{ image: string | null }> {
  const signal = AbortSignal.timeout(10000);
  let url = publicWebsiteUrl(website);
  for (let redirects = 0; redirects < 4; redirects++) {
    await validateDestination(url, signal);
    const response = await fetch(url.href, {
      redirect: "manual", signal,
      headers: { Accept: "text/html", "User-Agent": "Verdiqy-ProjectPreview/1.0" },
    });
    if (response.status >= 300 && response.status < 400) {
      await response.body?.cancel();
      const location = response.headers.get("location");
      if (!location) return { image: null };
      url = publicWebsiteUrl(new URL(location, url).href);
      continue;
    }
    if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) {
      await response.body?.cancel();
      return { image: null };
    }
    const reader = response.body?.getReader();
    if (!reader) return { image: null };
    const decoder = new TextDecoder();
    let html = "";
    let bytes = 0;
    try {
      while (bytes < 512000) {
        const chunk = await reader.read();
        if (chunk.done) break;
        bytes += chunk.value.byteLength;
        html += decoder.decode(chunk.value, { stream: true });
        if (/<\/head\s*>/i.test(html)) break;
      }
    } finally { await reader.cancel(); }
    const image = extractSocialImage(html, url.href);
    if (image) await validateDestination(publicWebsiteUrl(image), signal);
    return { image };
  }
  return { image: null };
}