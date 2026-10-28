import { QuotesIcon } from "@phosphor-icons/react";
import { BlockquoteRules } from "@platejs/basic-nodes";
import { BlockquotePlugin } from "@platejs/basic-nodes/react";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { blockquoteReader } from "#/content-editor/features/blockquote/reader.tsx";
import type { ContentFeature } from "#/content-editor/features/feature-definition.tsx";

export function BlockquoteElement(props: PlateElementProps) {
	return (
		<PlateElement
			{...props}
			as="blockquote"
			className="border-border border-l-2 pl-3 text-muted-foreground italic"
		/>
	);
}

export const blockquoteFeature: ContentFeature = {
	...blockquoteReader,
	plugins: () => [
		BlockquotePlugin.configure({ inputRules: [BlockquoteRules.markdown()] }),
	],
	components: { blockquote: BlockquoteElement },
	toolbar: [
		{
			key: "quote",
			group: "block",
			icon: QuotesIcon,
			label: "quote",
			isActive: (editor) => editor.api.some({ match: { type: "blockquote" } }),
			run: (editor) => editor.tf.toggleBlock("blockquote"),
		},
	],
	slash: [
		{
			key: "quote",
			icon: QuotesIcon,
			label: "quote",
			keywords: ["quote", "blockquote", "citation"],
			run: (editor) => editor.tf.toggleBlock("blockquote"),
		},
	],
};
