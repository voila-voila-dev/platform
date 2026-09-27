import { ChartBarIcon } from "@phosphor-icons/react";
import { useContentEditorLabels } from "#/content-editor/context/content-editor-context.tsx";
import { useContentEditorTheme } from "#/content-editor/context/theme-context.ts";
import {
	type ContentStatNode,
	statNode,
} from "#/content-editor/features/stat/reader.tsx";
import { alignmentField } from "#/content-editor/lib/alignment.ts";
import {
	type ContentElementViewProps,
	defineElementFeature,
} from "#/content-editor/lib/define-element-feature.ts";
import { cn } from "#/lib/utils.ts";

/**
 * The email block editor's stat view, as a preview. An empty value or label
 * shows its placeholder faded; an empty description shows nothing, as in the
 * sent email.
 */
function StatView({ node }: ContentElementViewProps<ContentStatNode>) {
	const theme = useContentEditorTheme();
	const { fields } = useContentEditorLabels();
	return (
		<div
			className="flex flex-col gap-1"
			style={{ textAlign: node.align, fontFamily: theme.font }}
		>
			<span
				className={cn(
					"font-bold text-[30px] leading-[1.1]",
					node.value === "" && "opacity-50",
				)}
				style={{ color: theme.color.brand }}
			>
				{node.value || fields.statValuePlaceholder}
			</span>
			<span
				className={cn(
					"font-semibold text-[12px] uppercase leading-[1.4] tracking-[0.04em]",
					node.label === "" && "opacity-50",
				)}
				style={{ color: theme.color.muted }}
			>
				{node.label || fields.statLabelPlaceholder}
			</span>
			{node.description === "" ? null : (
				<span
					className="text-[14px] leading-[1.5]"
					style={{ color: theme.color.ink }}
				>
					{node.description}
				</span>
			)}
		</div>
	);
}

export const statFeature = defineElementFeature<ContentStatNode>({
	key: "stat",
	kind: "void",
	node: statNode,
	fields: [
		{
			type: "text",
			key: "value",
			label: "statValue",
			placeholder: "statValuePlaceholder",
		},
		{
			type: "text",
			key: "label",
			label: "statLabel",
			placeholder: "statLabelPlaceholder",
		},
		{
			type: "text",
			key: "description",
			label: "statDescription",
			multiline: true,
		},
		alignmentField,
	],
	defaults: { value: "", label: "", description: "", align: "center" },
	view: StatView,
	insert: {
		icon: ChartBarIcon,
		keywords: ["stat", "figure", "number", "metric", "kpi"],
	},
});
