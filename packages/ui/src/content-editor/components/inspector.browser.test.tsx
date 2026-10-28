import { StarIcon } from "@phosphor-icons/react";
import { cleanup, render } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { ContentEditor } from "#/content-editor/components/namespace.ts";
import type {
	ContentNodeLike,
	ContentValue,
} from "#/content-editor/features/content-value.ts";
import { createContentFeatures } from "#/content-editor/features/create-content-features.ts";
import type { ContentFeature } from "#/content-editor/features/feature-definition.tsx";
import type { ContentMoney } from "#/content-editor/features/field-definition.ts";
import { defineElementFeature } from "#/content-editor/lib/define-element-feature.ts";

afterEach(cleanup);

interface CardNode extends ContentNodeLike {
	readonly type: "card";
	readonly title: string;
	readonly href: string;
	readonly tone: "plain" | "loud";
	readonly featured: boolean;
	readonly price: ContentMoney;
	readonly perks: ReadonlyArray<string>;
}

const cardFeature = defineElementFeature<CardNode>({
	key: "card",
	kind: "void",
	node: {
		type: "card",
		kind: "void",
		Render: ({ node }) => <div>{node.title}</div>,
		toHtml: (node) => `<div>${node.title}</div>`,
	},
	fields: [
		{ type: "text", key: "title", label: "Title" },
		{ type: "url", key: "href", label: "Link" },
		{
			type: "select",
			key: "tone",
			label: "Tone",
			options: [
				{ value: "plain", label: "Plain" },
				{ value: "loud", label: "Loud" },
			],
		},
		{ type: "boolean", key: "featured", label: "Featured" },
		{ type: "money", key: "price", label: "Price", currencies: ["EUR", "USD"] },
		{ type: "string-list", key: "perks", label: "Perk" },
	],
	defaults: {
		title: "",
		href: "",
		tone: "plain",
		featured: false,
		price: { amountInMinorUnits: 0, currency: "EUR" },
		perks: [],
	},
	view: ({ node }) => <div data-testid="card">{node.title || "Card"}</div>,
	insert: { icon: StarIcon, keywords: ["card"] },
});

const FEATURES: ReadonlyArray<ContentFeature> = [
	...createContentFeatures(),
	cardFeature,
];

let latest: ContentValue = [];

function EditorUnderTest({
	initial,
	upload,
}: {
	readonly initial: ContentValue;
	readonly upload?: (file: File) => Promise<{ url: string }>;
}) {
	const [value, setValue] = useState<ContentValue | null>(initial);
	latest = value ?? [];
	return (
		<ContentEditor.Root
			features={FEATURES}
			value={value}
			onChange={setValue}
			onUploadImage={upload}
		>
			<ContentEditor.Canvas />
			<ContentEditor.Inspector />
		</ContentEditor.Root>
	);
}

const PIXEL =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";

const nodeAt = (index: number) => latest[index] as ContentNodeLike;

async function pngFile(): Promise<File> {
	const canvas = document.createElement("canvas");
	canvas.width = 32;
	canvas.height = 18;
	const context = canvas.getContext("2d");
	if (context !== null) {
		context.fillStyle = "#f60";
		context.fillRect(0, 0, 32, 18);
	}
	const blob = await new Promise<Blob>((resolve) =>
		canvas.toBlob((result) => resolve(result as Blob), "image/png"),
	);
	return new File([blob], "photo.png", { type: "image/png" });
}

describe("ContentEditor.Inspector", () => {
	it("says there is nothing to edit until an element with fields is selected", async () => {
		render(
			<EditorUnderTest initial={[{ type: "p", children: [{ text: "Hi" }] }]} />,
		);
		await expect
			.element(page.getByText("Select a block to see its settings."))
			.toBeVisible();
	});

	it("edits the url of the link the caret sits in, and Enter hands the caret back", async () => {
		render(
			<EditorUnderTest
				initial={[
					{
						type: "p",
						children: [
							{ text: "Read " },
							{
								type: "a",
								url: "https://old.example",
								children: [{ text: "the post" }],
							},
							{ text: "." },
						],
					},
				]}
			/>,
		);
		await page.getByText("the post").click();
		const url = page.getByRole("textbox", { name: "URL" });
		await expect.element(url).toHaveValue("https://old.example");
		await url.fill("https://new.example");
		await expect
			.poll(() => (nodeAt(0).children[1] as ContentNodeLike).url)
			.toBe("https://new.example");
		await userEvent.keyboard("{Enter}");
		await expect
			.poll(() => document.activeElement?.getAttribute("data-slot"))
			.toBe("content-editor-canvas");
	});

	it("edits an image's alternative text and caption, and the canvas follows", async () => {
		render(
			<EditorUnderTest
				initial={[
					{ type: "p", children: [{ text: "Above" }] },
					{
						type: "image",
						url: PIXEL,
						children: [{ text: "" }],
					},
				]}
			/>,
		);
		await page.elementLocator(document.querySelector("img") as Element).click();
		await page
			.getByRole("textbox", { name: "Alternative text" })
			.fill("A red bike");
		await page.getByRole("textbox", { name: "Caption" }).fill("Our bike");
		await expect.poll(() => nodeAt(1).alt).toBe("A red bike");
		await expect.poll(() => nodeAt(1).caption).toBe("Our bike");
		await expect.element(page.getByText("Our bike")).toBeVisible();
	});

	it("uploads an image through the host, cropped, and puts its url on the node", async () => {
		const upload = vi.fn(async (_file: File) => ({
			url: "https://cdn.example/photo.png",
		}));
		render(
			<EditorUnderTest
				upload={upload}
				initial={[{ type: "image", url: "", children: [{ text: "" }] }]}
			/>,
		);
		await page.getByText("No image yet. Pick one in the settings.").click();
		const input = document.querySelector(
			'[data-slot="content-editor-inspector"] input[type="file"]',
		) as HTMLInputElement;
		await userEvent.upload(input, await pngFile());
		await page.getByRole("button", { name: "Apply" }).click();
		await expect
			.poll(() => nodeAt(0).url)
			.toBe("https://cdn.example/photo.png");
		expect(upload).toHaveBeenCalledTimes(1);
	});

	it("edits every field type of a defined element", async () => {
		render(
			<EditorUnderTest
				initial={[
					{ type: "p", children: [{ text: "Above" }] },
					cardFeature.nodes[0].createNode({ title: "Pro plan" }),
				]}
			/>,
		);
		await page.getByTestId("card").click();

		await page.getByRole("textbox", { name: "Title" }).fill("Team plan");
		await page.getByRole("textbox", { name: "Link" }).fill("https://x.example");
		await page.getByRole("combobox", { name: "Tone" }).click();
		await page.getByRole("option", { name: "Loud" }).click();
		await page.getByRole("switch", { name: "Featured" }).click();
		await page.getByRole("spinbutton", { name: "Price" }).fill("12.5");
		await page.getByRole("combobox", { name: "Currency" }).selectOptions("USD");
		await page.getByRole("button", { name: "Add" }).click();
		await page
			.getByRole("textbox", { name: "Perk 1" })
			.fill("Priority support");

		await expect
			.poll(() => nodeAt(1))
			.toMatchObject({
				type: "card",
				title: "Team plan",
				href: "https://x.example",
				tone: "loud",
				featured: true,
				price: { amountInMinorUnits: 1250, currency: "USD" },
				perks: ["Priority support"],
			});
		await expect
			.element(page.getByTestId("card"))
			.toHaveTextContent("Team plan");

		await page.getByRole("button", { name: "Remove item 1" }).click();
		await expect.poll(() => nodeAt(1).perks).toEqual([]);
	});
});

describe("⌘K with an inspector on screen", () => {
	const linked: ContentValue = [
		{
			type: "p",
			children: [
				{ text: "Read " },
				{
					type: "a",
					url: "https://old.example",
					children: [{ text: "the post" }],
				},
				{ text: " or the rest" },
			],
		},
	];

	function WithToolbar() {
		const [value, setValue] = useState<ContentValue | null>(linked);
		latest = value ?? [];
		return (
			<ContentEditor.Root features={FEATURES} value={value} onChange={setValue}>
				<ContentEditor.Toolbar />
				<ContentEditor.Canvas />
				<ContentEditor.FloatingToolbar />
				<ContentEditor.Inspector />
			</ContentEditor.Root>
		);
	}

	const linkForm = () =>
		document.querySelector("[data-slot=content-editor-link-popover]");

	it("focuses the inspector's url field when the caret is in a link, and opens no form", async () => {
		render(<WithToolbar />);
		await page.getByText("the post").click();
		await userEvent.keyboard("{ControlOrMeta>}k{/ControlOrMeta}");
		const url = page.getByRole("textbox", { name: "URL" });
		await expect.element(url).toHaveFocus();
		expect(linkForm()).toBeNull();
		await userEvent.keyboard("https://new.example{Enter}");
		await expect
			.poll(() => (nodeAt(0).children[1] as ContentNodeLike).url)
			.toBe("https://new.example");
	});

	it("focuses the inspector from the toolbar's link control too", async () => {
		render(<WithToolbar />);
		await page.getByText("the post").click();
		await page
			.getByRole("toolbar")
			.first()
			.getByRole("button", { name: "Link" })
			.click();
		await expect
			.element(page.getByRole("textbox", { name: "URL" }))
			.toHaveFocus();
		expect(linkForm()).toBeNull();
	});

	it("opens the form on a selection outside any link, to create one", async () => {
		render(<WithToolbar />);
		await page.getByText("or the rest").click();
		await userEvent.keyboard(
			"{Shift>}{ArrowLeft}{ArrowLeft}{ArrowLeft}{/Shift}",
		);
		await userEvent.keyboard("{ControlOrMeta>}k{/ControlOrMeta}");
		await vi.waitFor(() => expect(linkForm()).not.toBeNull());
		await userEvent.keyboard("https://rest.example{Enter}");
		await expect
			.poll(() =>
				nodeAt(0).children.some(
					(child) => (child as ContentNodeLike).url === "https://rest.example",
				),
			)
			.toBe(true);
	});
});
