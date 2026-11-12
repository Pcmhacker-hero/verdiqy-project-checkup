<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

- Codeforces photo proxy uses the main-site /userpic/ copy and the original photo host, preserving the uploaded path because the dedicated host can be unavailable independently.
- Codeforces search and comparison share a keyed avatar component that tries official hosts directly before the proxy and retries transient failures, because preview gateways can block ordinary proxy image requests.
- Account display is owned by a root-scoped CurrentUserProvider, with one session subscription and profile enrichment per identity; consumers share it across route changes, pending sessions never render Guest, and metadata is never authorization.
- Sidebar keyboard shortcuts are matched by the browser-safe sidebar-shortcut helper and handled in AppShell, keeping desktop collapse and mobile drawer toggles together without intercepting text editing.
- Search uses the root-scoped current-user readiness for display routing and a tested search-access decision; server authentication remains authoritative, avoiding duplicate session reads and stalled signed-out screens.
