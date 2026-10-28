import { TextTIcon } from "@phosphor-icons/react";
import {
	ParagraphPlugin,
	PlateElement,
	type PlateElementProps,
} from "platejs/react";
import type { ContentFeature } from "#/content-editor/features/feature-definition.tsx";
import { paragraphReader } from "#/content-editor/features/paragraph/reader.tsx";

/**
 * A plain block. List rendering is Plate's: `ListPlugin` wraps a paragraph
 * carrying `listStyleType` in `<ul><li>` below the node, and `IndentPlugin`
 * injects the margin, so this element draws neither a bullet nor an indent.
 */
export function ParagraphElement(props: PlateElementProps) {
	return <PlateElement {...props} />;
}

export const paragraphFeature: ContentFeature = {
	...paragraphReader,
	plugins: () => [ParagraphPlugin],
	components: { p: ParagraphElement },
	toolbar: [
		{
			key: "paragraph",
			group: "block",
			icon: TextTIcon,
			label: "paragraph",
			isActive: (editor) => editor.api.some({ match: { type: "p" } }),
			run: (editor) => editor.tf.toggleBlock("p"),
		},
	],
	allowIn: () => true,
};
