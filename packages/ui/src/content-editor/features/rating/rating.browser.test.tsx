import { cleanup, render } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import { ContentEditor } from "#/content-editor/components/namespace.ts";
import type {
	ContentNodeLike,
	ContentValue,
} from "#/content-editor/features/content-value.ts";
import { createContentFeatures } from "#/content-editor/features/create-content-features.ts";
import { ratingFeature } from "#/content-editor/features/rating/feature.tsx";
import { contentToHtml } from "#/content-editor/reader/content-to-html.ts";

afterEach(cleanup);

/** A whole authoring pass; the default 15 s is tight with the suite in parallel. */
const LONG_INTERACTION = 40_000;

const FEATURES = [...createContentFeatures(), ratingFeature];

let latest: ContentValue = [];

function Composer() {
	const [value, setValue] = useState<ContentValue | null>([
		{ type: "p", children: [{ text: "" }] },
	]);
	latest = value ?? [];
	return (
		<ContentEditor.Root
			features={FEATURES}
			value={value}
			onChange={setValue}
			appearance="email"
		>
			<ContentEditor.Canvas />
			<ContentEditor.Inspector />
		</ContentEditor.Root>
	);
}

const types = () => latest.map((node) => node.type);
const rating = () =>
	latest.find((node) => node.type === "rating") as ContentNodeLike | undefined;

describe("rating feature", () => {
	it(
		"takes its question as text, leaves it on Enter, and its settings in the inspector",
		async () => {
			render(<Composer />);
			await page.getByRole("textbox", { name: "Content editor" }).click();
			await userEvent.keyboard("/rating");
			await expect
				.element(page.getByRole("option", { name: "Rating" }))
				.toBeVisible();
			await userEvent.keyboard("{Enter}");
			await expect.poll(types).toContain("rating");
			await expect
				.element(page.getByText("How did your last session go?"))
				.toBeVisible();

			await userEvent.keyboard("How was training?");
			await expect
				.poll(
					() => (rating()?.children[0] as { text?: string } | undefined)?.text,
				)
				.toBe("How was training?");
			await userEvent.keyboard("{Enter}");
			await expect
				.poll(() => types().slice(types().indexOf("rating")))
				.toEqual(["rating", "p"]);
			await userEvent.keyboard("See you soon");

			await page.getByText("How was training?").click();
			await page.getByRole("combobox", { name: "Style" }).click();
			await page.getByRole("option", { name: "Outlined stars" }).click();
			await page
				.getByRole("textbox", { name: "Low end of the scale" })
				.fill("Meh");
			await page
				.getByRole("textbox", { name: "High end of the scale" })
				.fill("Great");
			await page
				.getByRole("textbox", { name: "Link" })
				.fill("https://club.example/survey?c=7");

			await expect.poll(rating).toMatchObject({
				style: "outline",
				lowLabel: "Meh",
				highLabel: "Great",
				href: "https://club.example/survey?c=7",
				children: [{ text: "How was training?" }],
			});
			await expect.element(page.getByText("Great")).toBeVisible();
			const html = contentToHtml(latest, { features: FEATURES });
			expect(html).toContain("<p>How was training?</p>");
			expect(html).toContain(
				'<a href="https://club.example/survey?c=7&amp;rating=3"><span aria-hidden="true">☆</span>',
			);
			expect(html).toMatch(/<\/div><p[^>]*>See you soon<\/p>$/);
			expect(types()).toEqual(["rating", "p"]);
		},
		LONG_INTERACTION,
	);
});
