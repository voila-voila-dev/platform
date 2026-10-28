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
import { createProductFeature } from "#/content-editor/features/product/feature.tsx";
import { contentToHtml } from "#/content-editor/reader/content-to-html.ts";

afterEach(cleanup);

/** A whole authoring pass; the default 15 s is tight with the suite in parallel. */
const LONG_INTERACTION = 40_000;

const FEATURES = [
	...createContentFeatures(),
	createProductFeature({ currencies: ["EUR", "USD"] }),
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
			appearance="email"
		>
			<ContentEditor.Canvas />
			<ContentEditor.Inspector />
		</ContentEditor.Root>
	);
}

const product = () =>
	latest.find((node) => node.type === "product") as ContentNodeLike | undefined;

describe("product feature", () => {
	it(
		"is inserted from / and priced in the inspector, with an optional base price",
		async () => {
			render(<Composer />);
			await page.getByRole("textbox", { name: "Content editor" }).click();
			await userEvent.keyboard("/product");
			await expect
				.element(page.getByRole("option", { name: "Product" }))
				.toBeVisible();
			await userEvent.keyboard("{Enter}");
			await expect.poll(product).toMatchObject({
				price: { amountInMinorUnits: 0, currency: "EUR" },
				compareAtPrice: null,
			});

			await page.getByRole("textbox", { name: "Name" }).fill("Team jersey");
			await page.getByRole("spinbutton", { name: "Price" }).fill("25.5");
			await page.getByRole("spinbutton", { name: "Base price" }).fill("30");
			await page.getByRole("textbox", { name: "Button label" }).fill("Order");
			await page
				.getByRole("textbox", { name: "Link" })
				.fill("https://shop.example/jersey");

			await expect.poll(product).toMatchObject({
				name: "Team jersey",
				price: { amountInMinorUnits: 2550, currency: "EUR" },
				compareAtPrice: { amountInMinorUnits: 3000, currency: "EUR" },
				buttonLabel: "Order",
				href: "https://shop.example/jersey",
			});
			await page
				.getByRole("combobox", { name: "Currency" })
				.first()
				.selectOptions("USD");
			await expect
				.poll(() => product()?.compareAtPrice)
				.toEqual({ amountInMinorUnits: 3000, currency: "USD" });
			await page
				.getByRole("combobox", { name: "Currency" })
				.first()
				.selectOptions("EUR");
			await expect.element(page.getByText("€25.50")).toBeVisible();
			await expect.element(page.getByText("€30.00")).toBeVisible();
			expect(contentToHtml(latest, { features: FEATURES })).toContain(
				"<p><strong>€25.50</strong> <s>€30.00</s></p>",
			);

			await page.getByRole("spinbutton", { name: "Base price" }).clear();
			await expect.poll(() => product()?.compareAtPrice ?? null).toBeNull();
			await expect.element(page.getByText("€30.00")).not.toBeInTheDocument();
		},
		LONG_INTERACTION,
	);
});
