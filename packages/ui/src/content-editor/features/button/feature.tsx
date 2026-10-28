import { CursorClickIcon } from "@phosphor-icons/react";
import { useContentEditorLabels } from "#/content-editor/context/content-editor-context.tsx";
import { useContentEditorTheme } from "#/content-editor/context/theme-context.ts";
import {
	buttonNode,
	type ContentButtonNode,
} from "#/content-editor/features/button/reader.tsx";
import { alignmentField, JUSTIFY } from "#/content-editor/lib/alignment.ts";
import {
	type ContentElementViewProps,
	defineElementFeature,
} from "#/content-editor/lib/define-element-feature.ts";

/**
 * The email block editor's button view, as a preview: the label, the target,
 * the alignment and the style are edited in the inspector.
 */
function ButtonView({ node }: ContentElementViewProps<ContentButtonNode>) {
	const theme = useContentEditorTheme();
	const { fields } = useContentEditorLabels();
	const filled = node.variant === "primary";
	const empty = node.label === "";
	return (
		<div className="flex" style={{ justifyContent: JUSTIFY[node.align] }}>
			<span
				className="inline-block rounded-lg px-[30px] py-[13px] text-center font-semibold text-[15px] leading-none"
				style={{
					backgroundColor: filled ? theme.color.brand : "transparent",
					border: `1px solid ${theme.color.brand}`,
					fontFamily: theme.font,
					color: filled ? "var(--color-primary-foreground)" : theme.color.brand,
				}}
			>
				<span className={empty ? "opacity-50" : undefined}>
					{empty ? fields.buttonPlaceholder : node.label}
				</span>
			</span>
		</div>
	);
}

export const buttonFeature = defineElementFeature<ContentButtonNode>({
	key: "button",
	kind: "void",
	node: buttonNode,
	fields: [
		{
			type: "text",
			key: "label",
			label: "buttonLabel",
			placeholder: "buttonPlaceholder",
		},
		{ type: "url", key: "href", label: "buttonLink" },
		{
			type: "select",
			key: "variant",
			label: "buttonStyle",
			options: [
				{ value: "primary", label: "buttonPrimary" },
				{ value: "secondary", label: "buttonSecondary" },
			],
		},
		alignmentField,
	],
	defaults: { label: "", href: "", variant: "primary", align: "center" },
	view: ButtonView,
	insert: {
		icon: CursorClickIcon,
		keywords: ["button", "cta", "call to action", "link"],
	},
});
