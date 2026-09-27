import {
	ContentEditorField,
	type ContentValue,
	createContentFeatures,
	variableFeature,
} from "@voila.dev/ui/content-editor";
import { useState } from "react";

const FEATURES = [...createContentFeatures(), variableFeature];

const VARIABLES = [
	{ name: "firstName", label: "First name" },
	{ name: "lastName", label: "Last name" },
	{ name: "email", label: "Email" },
];

const mail: ContentValue = [
	{
		type: "p",
		children: [
			{ text: "Hello " },
			{ type: "variable", name: "firstName", children: [{ text: "" }] },
			{ text: "," },
		],
	},
	{
		type: "p",
		children: [
			{ text: "Your spot for Saturday is confirmed. Type {{ for a variable." },
		],
	},
	{ type: "p", children: [{ text: "See you there,\nThe team" }] },
];

/** The campaign card, in a brand palette and font. */
export function EmailAppearance() {
	const [value, setValue] = useState<ContentValue | null>(mail);
	return (
		<ContentEditorField
			features={FEATURES}
			value={value}
			onChange={setValue}
			appearance="email"
			variables={VARIABLES}
			theme={{
				color: {
					brand: "#0f766e",
					canvas: "#f1f5f9",
					card: "#ffffff",
					ink: "#1f2937",
				},
				font: "Georgia, serif",
			}}
		/>
	);
}

/** A plain mail with the `{{` suggestions: type two braces. */
export function Variables() {
	const [value, setValue] = useState<ContentValue | null>(mail);
	return (
		<ContentEditorField
			features={FEATURES}
			value={value}
			onChange={setValue}
			appearance="plain"
			variables={VARIABLES}
		/>
	);
}
