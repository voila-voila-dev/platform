import { createRouter } from "@tanstack/react-router";
import { NotFound } from "@/components/docs/not-found";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true,
		defaultNotFoundComponent: NotFound,
		// Content links keep their Starlight-era trailing slashes; the static
		// host redirects either form onto the canonical one.
		trailingSlash: "never",
	});
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
