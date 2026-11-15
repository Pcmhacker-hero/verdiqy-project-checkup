import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Globe } from "lucide-react";
import { getProjectPreview } from "@/lib/project-preview.functions";
import { normalizeProjectLink } from "@/lib/project-link";

export function ProjectPreview({ website, title }: { website: string; title: string }) {
  const [failed, setFailed] = useState(false);
  const fetchPreview = useServerFn(getProjectPreview);
  let url = "";
  try { url = normalizeProjectLink(website); } catch { /* invalid stored link */ }
  const { data, isPending } = useQuery({
    queryKey: ["project-preview", url],
    queryFn: () => fetchPreview({ data: { website: url } }),
    enabled: Boolean(url),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: false,
  });
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${title}`}
      className="mb-4 flex aspect-[1.91/1] w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-muted">
      {data?.image && !failed ? (
        <img src={data.image} alt={`${title} website preview`} referrerPolicy="no-referrer"
          loading="lazy" decoding="async" onError={() => setFailed(true)}
          className="h-full w-full object-contain" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Globe className="size-8" aria-hidden="true" />
          <span className="max-w-full break-all px-4 text-sm">{new URL(url).hostname}</span>
          {isPending ? <span className="sr-only">Loading website preview</span> : null}
        </div>
      )}
    </a>
  );
}