import { cleanup, render } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import { ContentEditor } from "#/content-editor/components/namespace.ts";
import { buttonFeature } from "#/content-editor/features/button/feature.tsx";
import type {
	ContentNodeLike,
	ContentValue,
} from "#/content-editor/features/content-value.ts";
import { createContentFeatures } from "#/content-editor/features/create-content-features.ts";
import { contentToHtml } from "#/content-editor/reader/content-to-html.ts";

afterEach(cleanup);

const FEATURES = [...createContentFeatures(), buttonFeature];

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

const nodeAt = (index: number) => latest[index] as ContentNodeLike;

describe("button feature", () => {
	it("is inserted from the slash menu and filled in from the inspector", async () => {
		render(<Composer />);
		await page.getByRole("textbox", { name: "Content editor" }).click();
		await userEvent.keyboard("/button");
		await expect
			.element(page.getByRole("option", { name: "Button" }))
			.toBeVisible();
		await userEvent.keyboard("{Enter}");
		await expect
			.poll(() =>
				latest.find((node) => (node as ContentNodeLike).type === "button"),
			)
			.toMatchObject({
				label: "",
				href: "",
				variant: "primary",
				align: "center",
			});
		const index = () =>
			latest.findIndex((node) => (node as ContentNodeLike).type === "button");

		await page.getByRole("textbox", { name: "Label" }).fill("Book a slot");
		await page
			.getByRole("textbox", { name: "Link" })
			.fill("https://example.com/book");
		await page.getByRole("combobox", { name: "Style" }).click();
		await page.getByRole("option", { name: "Outline" }).click();
		await page.getByRole("combobox", { name: "Alignment" }).click();
		await page.getByRole("option", { name: "Right" }).click();

		await expect
			.poll(() => nodeAt(index()))
			.toMatchObject({
				type: "button",
				label: "Book a slot",
				href: "https://example.com/book",
				variant: "secondary",
				align: "right",
			});
		const preview = page.getByText("Book a slot", { exact: true });
		await expect.element(preview).toBeVisible();
		expect(contentToHtml(latest, { features: FEATURES })).toMatch(
			/^<p id="[^"]+" style="text-align:right"><a href="https:\/\/example.com\/book" class="button button-secondary">Book a slot<\/a><\/p><p id="[^"]+"><\/p>$/,
		);
	});
});
