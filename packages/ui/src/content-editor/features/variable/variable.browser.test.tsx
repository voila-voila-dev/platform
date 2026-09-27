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
import { variableFeature } from "#/content-editor/features/variable/feature.tsx";
import { contentToHtml } from "#/content-editor/reader/content-to-html.ts";

afterEach(cleanup);

const FEATURES = [...createContentFeatures(), variableFeature];
const VARIABLES = [
	{ name: "firstName", label: "First name" },
	{ name: "lastName", label: "Last name" },
	{ name: "email" },
];

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
			variables={VARIABLES}
		>
			<ContentEditor.Canvas />
		</ContentEditor.Root>
	);
}

const paragraph = () => latest[0] as ContentNodeLike;

async function typeInEmptyComposer(keys: string) {
	render(<Composer />);
	await page.getByRole("textbox", { name: "Content editor" }).click();
	await userEvent.keyboard(keys);
}

describe("variable feature", () => {
	it("opens the variables on {{ and puts the picked one as a chip", async () => {
		// `{{` is how user-event escapes one `{`.
		await typeInEmptyComposer("Hello {{{{");
		const menu = page.getByRole("listbox");
		await expect.element(menu.getByText("First name")).toBeVisible();
		await expect.element(menu.getByText("email")).toBeVisible();

		await userEvent.keyboard("last");
		await expect.element(menu.getByText("First name")).not.toBeInTheDocument();
		await userEvent.keyboard("{Enter}");

		await expect
			.poll(() =>
				paragraph().children.find(
					(child) => (child as ContentNodeLike).type === "variable",
				),
			)
			.toMatchObject({ type: "variable", name: "lastName" });
		await expect
			.element(page.getByText("Last name", { exact: true }))
			.toBeVisible();

		await userEvent.keyboard(", welcome");
		await expect
			.poll(() => contentToHtml(latest, { features: FEATURES }))
			.toContain("Hello {{lastName}}, welcome");
	});

	it("gives back what was typed when the author leaves with Escape", async () => {
		await typeInEmptyComposer("Price: {{{{fir");
		await expect.element(page.getByRole("listbox")).toBeVisible();
		await userEvent.keyboard("{Escape}");
		await expect
			.poll(() => JSON.stringify(paragraph().children))
			.toContain("Price: {{fir");
		expect(
			paragraph().children.some(
				(child) => (child as ContentNodeLike).type === "variable",
			),
		).toBe(false);
	});

	it("leaves a single brace as text", async () => {
		await typeInEmptyComposer("a {{b}");
		await expect
			.poll(() => JSON.stringify(paragraph().children))
			.toContain("a {b}");
	});
});
