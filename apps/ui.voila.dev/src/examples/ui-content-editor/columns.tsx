import {
	ContentEditor,
	type ContentValue,
	columnsFeature,
	createContentFeatures,
} from "@voila.dev/ui/content-editor";
import { useState } from "react";

const FEATURES = [...createContentFeatures(), columnsFeature];

const cell = (title: string, line: string) => ({
	type: "column",
	children: [
		{ type: "h3", children: [{ text: title }] },
		{ type: "p", children: [{ text: line }] },
	],
});

const initial: ContentValue = [
	{
		type: "columns",
		desktopColumns: 3,
		mobileColumns: 1,
		children: [
			cell("Coaching", "One session a week, at the club."),
			cell("Recovery", "Massage after every match."),
			cell("Nutrition", "A plan for the season."),
		],
	},
	{ type: "p", children: [{ text: "Type / and pick Columns for a new row." }] },
];

/** Three columns; click in one for its counts and columns in the inspector. */
export function Columns() {
	const [value, setValue] = useState<ContentValue | null>(initial);
	return (
		<ContentEditor.Root features={FEATURES} value={value} onChange={setValue}>
			<div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,1fr)_18rem]">
				<ContentEditor.Layout>
					<ContentEditor.Toolbar />
					<ContentEditor.Canvas />
				</ContentEditor.Layout>
				<ContentEditor.Inspector className="rounded-lg border border-border p-4" />
			</div>
		</ContentEditor.Root>
	);
}
