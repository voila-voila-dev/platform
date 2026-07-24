import path from "node:path";
import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig, type UserConfig } from "vite";
import {
	docsManifest,
	docsPages,
	docsSearchIndex,
} from "./src/lib/docs-plugin";
import { remarkTocExport } from "./src/lib/remark-toc-export";

export default defineConfig({
	resolve: {
		alias: {
			"@": path.join(import.meta.dirname, "src"),
		},
	},
	plugins: [
		tailwindcss(),
		docsManifest(),
		docsSearchIndex(),
		{
			// `enforce: "pre"` so MDX compiles to JSX before React's plugin runs.
			enforce: "pre",
			...mdx({
				providerImportSource: "@mdx-js/react",
				remarkPlugins: [
					remarkFrontmatter,
					[remarkMdxFrontmatter, { name: "frontmatter" }],
					remarkGfm,
					remarkTocExport,
				],
				rehypePlugins: [
					rehypeSlug,
					[
						rehypeAutolinkHeadings,
						{
							behavior: "wrap",
							properties: { className: ["heading-anchor"] },
						},
					],
					[
						rehypePrettyCode,
						{
							theme: {
								light: "github-light-default",
								dark: "github-dark-default",
							},
							keepBackground: false,
							defaultLang: "txt",
						},
					],
				],
			}),
		},
		tanstackStart({
			prerender: {
				enabled: true,
				crawlLinks: true,
				autoSubfolderIndex: true,
				failOnError: true,
			},
			pages: [
				...docsPages(),
				{
					path: "/404",
					sitemap: { exclude: true },
					prerender: { enabled: true, outputPath: "/404.html" },
				},
			],
			sitemap: { enabled: true, host: "https://ui.voila.dev" },
		}),
		viteReact(),
		{
			// On Rolldown-Vite, `output.strictExecutionOrder` severs Base UI's
			// `createSelectorMemoized` import bindings in production builds (same
			// workaround as the Storybook app — see its `.storybook/main.ts`).
			name: "voila:disable-strict-execution-order",
			enforce: "post",
			config(config: UserConfig) {
				const output = config.build?.rolldownOptions?.output;
				if (output && !Array.isArray(output)) {
					// strictExecutionOrder is experimental and not in the types yet.
					(output as Record<string, unknown>).strictExecutionOrder = false;
				}
			},
		},
	],
});
