import { MegaphoneIcon } from "@phosphor-icons/react";
import { useContentEditorTheme } from "#/content-editor/context/theme-context.ts";
import {
	type ContentHighlightNode,
	highlightNode,
} from "#/content-editor/features/highlight/reader.tsx";
import { alignmentField } from "#/content-editor/lib/alignment.ts";
import {
	type ContentElementViewProps,
	defineElementFeature,
} from "#/content-editor/lib/define-element-feature.ts";

/** The email block editor's highlight view, its text now typed in place. */
function HighlightView({
	node,
	children,
}: ContentElementViewProps<ContentHighlightNode>) {
	const theme = useContentEditorTheme();
	return (
		<div
			className="rounded-[10px] px-6 py-4"
			style={{
				backgroundColor: `color-mix(in srgb, ${theme.color.brand} 8%, transparent)`,
			}}
		>
			<div
				className="font-bold text-[20px] leading-[1.35]"
				style={{
					color: theme.color.brand,
					fontFamily: theme.font,
					textAlign: node.align,
				}}
			>
				{children}
			</div>
		</div>
	);
}

export const highlightFeature = defineElementFeature<ContentHighlightNode>({
	key: "highlight",
	kind: "text",
	node: highlightNode,
	fields: [alignmentField],
	defaults: { align: "center" },
	view: HighlightView,
	insert: {
		icon: MegaphoneIcon,
		keywords: ["highlight", "promo", "banner", "announcement"],
	},
});
