/**
 * Makes a page that renders with an error fail the build.
 *
 * `prerender.failOnError` only covers a route that throws or answers non-2xx.
 * An error *inside* the React render is different: React hands it to the
 * `onError` callback, drops the offending subtree, and finishes the stream. The
 * response is still 200, the prerenderer records a success, and the page is
 * written to disk with a hole in it.
 *
 * That is not hypothetical. `start/installation.mdx` rendered `<Tabs.Root>`
 * against a `Tabs` that is not a namespace; the build logged
 * `Expected component 'Tabs.Root' to be defined`, exited 0, and shipped the
 * install page with its entire tabbed block missing. The emitted HTML carries
 * no marker, so grepping the output afterwards would not have caught it either.
 *
 * `@tanstack/react-router`'s `renderRouterToStream` reports these through
 * `console.error` and exposes no hook, so this listens on `console.error`. It
 * is a backstop: `scripts/check-docs.mjs` is what should catch an undefined
 * component at author time. This is what catches everything else.
 */
import type { Plugin } from "vite";

/** What `renderRouterToStream` prefixes every swallowed render error with. */
const RENDER_ERROR = /Error in render(?:ToReadableStream|ToPipeableStream):/;

/**
 * Pages prerender concurrently, so the most recent `[prerender] Crawling: …`
 * line is not reliably the page that failed — attributing by log order named
 * the wrong page. The error's own stack is not racy: every MDX page compiles to
 * its own server chunk, named after the source file.
 */
const SERVER_CHUNK = /assets\/([A-Za-z0-9._-]+?)-[A-Za-z0-9_-]{6,}\.m?js/;

function describe(value: unknown): string {
	if (value instanceof Error) return `${value.message}\n${value.stack ?? ""}`;
	if (typeof value === "string") return value;
	if (value && typeof value === "object") {
		const stack = (value as { componentStack?: unknown }).componentStack;
		if (typeof stack === "string") return stack;
	}
	return "";
}

function message(value: unknown): string {
	if (value instanceof Error) return value.message;
	return typeof value === "string" ? value : "";
}

export function failOnPrerenderError(): Plugin {
	const failures: { where: string; what: string }[] = [];

	return {
		name: "voila:fail-on-prerender-error",
		apply: "build",
		enforce: "post",

		buildStart() {
			const error = console.error;

			console.error = (...args: unknown[]) => {
				const joined = args.map(describe).join("\n");
				if (RENDER_ERROR.test(joined)) {
					const chunk = SERVER_CHUNK.exec(joined);
					const failure = {
						where: chunk ? `${chunk[1]} (server chunk)` : "unknown module",
						what: args.map(message).filter(Boolean).join(" — "),
					};
					// React reports the same error once for the shell and once for
					// the stream, so the same pair arrives twice.
					const seen = failures.some(
						(f) => f.where === failure.where && f.what === failure.what,
					);
					if (!seen) failures.push(failure);
				}
				error(...args);
			};

			// The prerender crawl runs *after* every plugin's `closeBundle` — by
			// the time the first page renders, Rollup is done and there is no
			// build hook left to fail in. So the console stays patched for the
			// rest of the process and the verdict is delivered on the way out.
			process.on("exit", () => {
				if (!failures.length) return;
				const detail = failures
					.map(({ where, what }) => `  ${where}: ${what}`)
					.join("\n");
				error(
					`\n${failures.length} page(s) rendered with an error and were written to disk anyway:\n${detail}\n\n` +
						"React recovers from these by dropping the subtree, so the page ships with a hole in it and the build stays green. Fix the render error.\n",
				);
				process.exitCode = 1;
			});
		},
	};
}
