import type { ContentValue } from "@voila.dev/ui/content-editor";

/** No backend in the docs: the picked file is served from an object URL. */
export async function fakeUploadImage(file: File) {
	await new Promise((resolve) => setTimeout(resolve, 600));
	return { url: URL.createObjectURL(file) };
}

export const article: ContentValue = [
	{ type: "h2", children: [{ text: "Writing inside your own app" }] },
	{
		type: "p",
		children: [
			{ text: "Rich text with " },
			{ text: "bold", bold: true },
			{ text: ", " },
			{ text: "italic", italic: true },
			{ text: " and a " },
			{ type: "a", url: "https://ui.voila.dev", children: [{ text: "link" }] },
			{
				text: ". Type / for a block, or select text for the floating toolbar.",
			},
		],
	},
	{
		type: "callout",
		icon: "💡",
		children: [{ text: "Every block on this page is one feature definition." }],
	},
	{
		type: "p",
		listStyleType: "disc",
		indent: 1,
		children: [{ text: "Lists, with Tab to nest" }],
	},
	{
		type: "p",
		listStyleType: "disc",
		indent: 1,
		children: [{ text: "Tables, images, embeds" }],
	},
	{
		type: "blockquote",
		children: [{ text: "And a quote, for when someone else said it better." }],
	},
];
