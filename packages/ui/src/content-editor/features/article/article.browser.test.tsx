import { cleanup, render } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { ContentEditor } from "#/content-editor/components/namespace.ts";
import { articleFeature } from "#/content-editor/features/article/feature.tsx";
import type {
	ContentNodeLike,
	ContentValue,
} from "#/content-editor/features/content-value.ts";
import { createContentFeatures } from "#/content-editor/features/create-content-features.ts";
import { contentToHtml } from "#/content-editor/reader/content-to-html.ts";

afterEach(cleanup);

/** A whole authoring pass; the default 15 s is tight with the suite in parallel. */
const LONG_INTERACTION = 40_000;

const FEATURES = [...createContentFeatures(), articleFeature];

let latest: ContentValue = [];

function Composer({
	upload,
}: {
	readonly upload: (file: File) => Promise<{ url: string }>;
}) {
	const [value, setValue] = useState<ContentValue | null>([
		{ type: "p", children: [{ text: "" }] },
	]);
	latest = value ?? [];
	return (
		<ContentEditor.Root
			features={FEATURES}
			value={value}
			onChange={setValue}
			onUploadImage={upload}
			appearance="email"
		>
			<ContentEditor.Canvas />
			<ContentEditor.Inspector />
		</ContentEditor.Root>
	);
}

const article = () =>
	latest.find((node) => node.type === "article") as ContentNodeLike | undefined;

async function pngFile(): Promise<File> {
	const canvas = document.createElement("canvas");
	canvas.width = 32;
	canvas.height = 18;
	const blob = await new Promise<Blob>((resolve) =>
		canvas.toBlob((result) => resolve(result as Blob), "image/png"),
	);
	return new File([blob], "cover.png", { type: "image/png" });
}

describe("article feature", () => {
	it(
		"is inserted from / and every field is edited in the inspector",
		async () => {
			const upload = vi.fn(async () => ({
				url: "https://cdn.example/cover.png",
			}));
			render(<Composer upload={upload} />);
			await page.getByRole("textbox", { name: "Content editor" }).click();
			await userEvent.keyboard("/article");
			await expect
				.element(page.getByRole("option", { name: "Article" }))
				.toBeVisible();
			await userEvent.keyboard("{Enter}");
			await expect.poll(article).toMatchObject({ type: "article", title: "" });
			await expect.element(page.getByText("Article title")).toBeVisible();

			await page.getByRole("textbox", { name: "Title" }).fill("Meet the coach");
			await page
				.getByRole("textbox", { name: "Summary" })
				.fill("Twelve years on the pitch.");
			await page.getByRole("textbox", { name: "Author" }).fill("Ana Lima");
			await page
				.getByRole("textbox", { name: "Publication date" })
				.fill("2026-07-20");
			await page
				.getByRole("textbox", { name: "Link" })
				.fill("https://example.com/coach");
			await page.getByRole("textbox", { name: "Alternative text" }).fill("Ana");
			const input = document.querySelector(
				'[data-slot="content-editor-inspector"] input[type="file"]',
			) as HTMLInputElement;
			await userEvent.upload(input, await pngFile());
			await page.getByRole("button", { name: "Apply" }).click();

			await expect.poll(article).toMatchObject({
				title: "Meet the coach",
				description: "Twelve years on the pitch.",
				author: "Ana Lima",
				publishDate: "2026-07-20",
				href: "https://example.com/coach",
				image: { src: "https://cdn.example/cover.png", alt: "Ana" },
			});
			await expect
				.element(page.getByText("Ana Lima · July 20, 2026"))
				.toBeVisible();
			expect(contentToHtml(latest, { features: FEATURES })).toContain(
				'<h3><a href="https://example.com/coach">Meet the coach</a></h3><p>Ana Lima · July 20, 2026</p>',
			);
		},
		LONG_INTERACTION,
	);
});
