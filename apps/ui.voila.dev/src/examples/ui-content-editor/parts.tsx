import {
	ContentEditor,
	ContentEditorField,
	type ContentValue,
	createContentFeatures,
	createInlineContentFeatures,
} from "@voila.dev/ui/content-editor";
import { useState } from "react";
import { article } from "./fixtures";

const FEATURES = createContentFeatures();
const INLINE = createInlineContentFeatures();

/** The parts composed by hand: only the text and block groups in the toolbar. */
export function ComposedByHand() {
	const [value, setValue] = useState<ContentValue | null>(article);
	const items = FEATURES.flatMap((feature) => feature.toolbar ?? []);
	return (
		<ContentEditor.Root features={FEATURES} value={value} onChange={setValue}>
			<ContentEditor.Layout>
				<ContentEditor.Toolbar>
					<ContentEditor.ToolbarGroup
						items={items.filter((item) => item.group === "text")}
					/>
					<ContentEditor.ToolbarGroup
						items={items.filter((item) => item.group === "block")}
					/>
				</ContentEditor.Toolbar>
				<ContentEditor.Canvas />
			</ContentEditor.Layout>
			<ContentEditor.FloatingToolbar />
		</ContentEditor.Root>
	);
}

/** One line, marks and links, no toolbar: a caption, a FAQ answer, a subtitle. */
export function SingleLine() {
	const [value, setValue] = useState<ContentValue | null>([
		{
			type: "p",
			children: [
				{ text: "A subtitle with " },
				{ text: "emphasis", italic: true },
			],
		},
	]);
	return (
		<div className="max-w-md">
			<ContentEditorField
				features={INLINE}
				mode="single-line"
				value={value}
				onChange={setValue}
				toolbar={false}
			/>
		</div>
	);
}
