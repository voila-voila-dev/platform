import { AsteriskIcon } from "@phosphor-icons/react";
import { useContentEditorTheme } from "#/content-editor/context/theme-context.ts";
import {
	type ContentFinePrintNode,
	finePrintNode,
} from "#/content-editor/features/fine-print/reader.tsx";
import {
	type ContentElementViewProps,
	defineElementFeature,
} from "#/content-editor/lib/define-element-feature.ts";

/** The email block editor's fine print view: small, muted and centred. */
function FinePrintView({
	children,
}: ContentElementViewProps<ContentFinePrintNode>) {
	const theme = useContentEditorTheme();
	return (
		<div
			className="text-center text-[11px] leading-[1.5]"
			style={{ fontFamily: theme.font, color: theme.color.muted }}
		>
			{children}
		</div>
	);
}

export const finePrintFeature = defineElementFeature<ContentFinePrintNode>({
	key: "finePrint",
	kind: "text",
	node: finePrintNode,
	fields: [],
	defaults: {},
	view: FinePrintView,
	insert: {
		icon: AsteriskIcon,
		keywords: ["fine print", "small print", "conditions", "disclaimer"],
	},
});
