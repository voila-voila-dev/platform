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
import { offerFeature } from "#/content-editor/features/offer/feature.tsx";
import { contentToHtml } from "#/content-editor/reader/content-to-html.ts";

afterEach(cleanup);

/** A whole authoring pass; the default 15 s is tight with the suite in parallel. */
const LONG_INTERACTION = 40_000;

const FEATURES = [...createContentFeatures(), offerFeature];

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

const offer = () =>
	latest.find((node) => node.type === "offer") as ContentNodeLike | undefined;

describe("offer feature", () => {
	it(
		"is inserted from /, gets its features one by one and can be highlighted",
		async () => {
			render(<Composer />);
			await page.getByRole("textbox", { name: "Content editor" }).click();
			await userEvent.keyboard("/offer");
			await expect
				.element(page.getByRole("option", { name: "Offer" }))
				.toBeVisible();
			await userEvent.keyboard("{Enter}");
			await expect
				.poll(offer)
				.toMatchObject({ features: [], highlighted: false });

			await page.getByRole("textbox", { name: "Eyebrow" }).fill("Most popular");
			await page.getByRole("textbox", { name: "Name" }).fill("Club");
			await page.getByRole("spinbutton", { name: "Price" }).fill("19");
			await page
				.getByRole("textbox", { name: "Billing period" })
				.fill("per month");
			await page.getByRole("button", { name: "Add" }).click();
			await page
				.getByRole("textbox", { name: "Included feature 1" })
				.fill("Unlimited teams");
			await page.getByRole("button", { name: "Add" }).click();
			await page
				.getByRole("textbox", { name: "Included feature 2" })
				.fill("Priority support");
			await page.getByRole("textbox", { name: "Button label" }).fill("Join");
			await page
				.getByRole("textbox", { name: "Button link" })
				.fill("https://example.com/join");
			await page.getByRole("switch", { name: "Highlight" }).click();

			await expect.poll(offer).toMatchObject({
				eyebrow: "Most popular",
				name: "Club",
				price: { amountInMinorUnits: 1900, currency: "EUR" },
				period: "per month",
				features: ["Unlimited teams", "Priority support"],
				buttonLabel: "Join",
				buttonHref: "https://example.com/join",
				highlighted: true,
			});
			await expect
				.element(page.getByText("Priority support", { exact: true }).first())
				.toBeVisible();
			expect(contentToHtml(latest, { features: FEATURES })).toContain(
				"<ul><li>Unlimited teams</li><li>Priority support</li></ul>",
			);

			await page.getByRole("button", { name: "Remove item 1" }).click();
			await expect.poll(() => offer()?.features).toEqual(["Priority support"]);
		},
		LONG_INTERACTION,
	);
});
