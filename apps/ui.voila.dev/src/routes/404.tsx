import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "@/components/docs/not-found";

/**
 * Prerendered to `/404.html`, which the Cloudflare static-assets worker serves
 * (with a 404 status) for any path that has no file — see `wrangler.jsonc`'s
 * `not_found_handling`.
 */
export const Route = createFileRoute("/404")({
	head: () => ({ meta: [{ title: "Not found · ui.voila.dev" }] }),
	component: NotFound,
});
