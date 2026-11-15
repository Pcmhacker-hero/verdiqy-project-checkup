import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getProjectPreview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ website: z.string().url().max(2048) }).parse(input))
  .handler(async ({ data }) => {
    try {
      const { fetchProjectPreview } = await import("./project-preview.server");
      return await fetchProjectPreview(data.website);
    } catch {
      return { image: null };
    }
  });