/** Codeforces rating bands, shared so every page colours a rating the same way. */
const BANDS: { min: number; rank: string; className: string }[] = [
  { min: 3000, rank: "legendary grandmaster", className: "text-red-600" },
  { min: 2600, rank: "international grandmaster", className: "text-red-500" },
  { min: 2400, rank: "grandmaster", className: "text-red-500" },
  { min: 2300, rank: "international master", className: "text-orange-500" },
  { min: 2100, rank: "master", className: "text-orange-500" },
  { min: 1900, rank: "candidate master", className: "text-violet-500" },
  { min: 1600, rank: "expert", className: "text-blue-500" },
  { min: 1400, rank: "specialist", className: "text-cyan-500" },
  { min: 1200, rank: "pupil", className: "text-emerald-500" },
];

const UNRATED = "text-muted-foreground";

export function ratingColor(rating?: number | null): string {
  if (rating == null || !Number.isFinite(rating) || rating <= 0) return UNRATED;
  return BANDS.find((b) => rating >= b.min)?.className ?? UNRATED;
}

/** Uses the rating when known, otherwise the exact Codeforces rank name. */
export function rankColor(rank?: string | null, rating?: number | null): string {
  if (rating != null && rating > 0) return ratingColor(rating);
  const name = rank?.trim().toLowerCase();
  return BANDS.find((b) => b.rank === name)?.className ?? UNRATED;
}
