import {
	ContentEditorField,
	type ContentValue,
	createContentFeatures,
} from "@voila.dev/ui/content-editor";
import { useState } from "react";

const FEATURES = createContentFeatures();

const tryTheKeys: ContentValue = [
	{
		type: "p",
		children: [
			{ text: "Shift+Enter breaks this line without a new paragraph." },
		],
	},
	{
		type: "p",
		children: [
			{ text: "Select " },
			{ text: "these words", bold: true },
			{ text: " and press ⌘K, or paste a URL over them." },
		],
	},
	{
		type: "p",
		listStyleType: "disc",
		indent: 1,
		children: [{ text: "Enter on an empty item leaves the list" }],
	},
	{
		type: "p",
		listStyleType: "disc",
		indent: 2,
		children: [{ text: "Backspace at the start of an item outdents it" }],
	},
	{
		type: "p",
		children: [{ text: "Arrow down onto the divider, Backspace, then ⌘Z." }],
	},
	{ type: "hr", children: [{ text: "" }] },
	{
		type: "p",
		children: [
			{ text: "Type ## , > , 1. or --- at the start of an empty line." },
		],
	},
];

/** A document that says, block by block, which key to try on it. */
export function Keyboard() {
	const [value, setValue] = useState<ContentValue | null>(tryTheKeys);
	return (
		<ContentEditorField features={FEATURES} value={value} onChange={setValue} />
	);
}
