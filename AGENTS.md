<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep Conocimiento public routes under `/conocimiento` and administrative routes under the authenticated layout; this preserves existing public URLs and isolates private data.
- Use the safe `public_resources` projection for public reads, authenticated RLS clients for administration, and service credentials only for validated gated access writes and signed file access; this prevents exposure of prospects and private file paths.
- Store resources and leads in Lovable Cloud, with private object buckets and temporary signed access URLs; browser storage is never the source of truth.
- Keep role assignment in `user_roles`; bootstrap only the existing verified owner email when no administrator exists, and authorize every administrative server function independently.
- Keep privacy configuration in `knowledge_settings` and require a confirmed notice before capturing resource leads; this avoids collecting personal data without a usable notice.
- Preserve submitted identity and consent per resource access without overwriting existing lead identity; this prevents unauthenticated submissions from altering historical consent.
- Keep password-recovery state in the root auth-event context; the auth client can consume the recovery URL before the reset form mounts.
- Preserve the existing single-page sections and make their anchors point home from added pages; only Conocimiento gets new public navigation routes.
