import { cleanup, render } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { ContentEditor } from "#/content-editor/components/namespace.ts";
import type {
	ContentNodeLike,
	ContentValue,
} from "#/content-editor/features/content-value.ts";
import { createContentFeatures } from "#/content-editor/features/create-content-features.ts";
import { contentToHtml } from "#/content-editor/reader/content-to-html.ts";

afterEach(cleanup);

const FEATURES = createContentFeatures();

const PIXEL =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";

let latest: ContentValue = [];

function Composer() {
	const [value, setValue] = useState<ContentValue | null>([
		{ type: "p", children: [{ text: "Above" }] },
		{ type: "image", url: PIXEL, alt: "Match", children: [{ text: "" }] },
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

const image = () => latest[1] as ContentNodeLike;

describe("image email options", () => {
	it("links, narrows and badges an image from the inspector", async () => {
		render(<Composer />);
		const img = document.querySelector("img") as HTMLImageElement;
		await page.elementLocator(img).click();

		await page
			.getByRole("textbox", { name: "Link" })
			.fill("https://example.com/video");
		await page.getByRole("combobox", { name: "Width" }).click();
		await page
			.getByRole("option", { name: "Reduced width (centered)" })
			.click();
		await page.getByRole("combobox", { name: "Overlay" }).click();
		await page
			.getByRole("option", { name: "Play button (video thumbnail)" })
			.click();

		await expect
			.poll(() => image())
			.toMatchObject({
				href: "https://example.com/video",
				size: "contained",
				overlay: "play",
			});
		const frame = img.parentElement?.parentElement as HTMLElement;
		await expect.poll(() => frame.style.width).toBe("60%");
		expect(img.parentElement?.querySelector("svg")).not.toBeNull();
		expect(contentToHtml(latest, { features: FEATURES })).toContain(
			'style="width:60%;margin-inline:auto" data-overlay="play"><a href="https://example.com/video"><img src="data:image/png',
		);
	});
});
