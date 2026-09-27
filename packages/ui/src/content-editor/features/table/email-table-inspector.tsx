import type { Path } from "platejs";
import { useEditorRef } from "platejs/react";
import { useId } from "react";
import { SelectFieldControl } from "#/content-editor/components/field-controls/select-field-control.tsx";
import type { ContentInspectorSectionProps } from "#/content-editor/features/feature-definition.tsx";
import type { ContentSelectField } from "#/content-editor/features/field-definition.ts";
import type {
	ContentTableColumnAlign,
	ContentTableNode,
} from "#/content-editor/features/table/reader.tsx";
import { useFieldText } from "#/content-editor/hooks/use-field-text.ts";
import { Field } from "#/field/components/field.tsx";

const ALIGN_FIELD: ContentSelectField<"align", ContentTableColumnAlign> = {
	type: "select",
	key: "align",
	label: "tableColumn",
	options: [
		{ value: "left", label: "tableAlignLeft" },
		{ value: "right", label: "tableAlignRight" },
	],
};

function ColumnAlign({
	index,
	align,
	onChange,
}: {
	readonly index: number;
	readonly align: ContentTableColumnAlign;
	readonly onChange: (align: ContentTableColumnAlign) => void;
}) {
	const id = useId();
	const text = useFieldText();
	return (
		<Field.Root>
			<Field.Label
				htmlFor={id}
			>{`${text("tableColumn")} ${index + 1}`}</Field.Label>
			<SelectFieldControl
				id={id}
				field={ALIGN_FIELD}
				value={align}
				onChange={(next) => onChange(next as ContentTableColumnAlign)}
			/>
		</Field.Root>
	);
}

/** Each column's alignment, as the email block editor's column settings. */
export function EmailTableInspector({ node }: ContentInspectorSectionProps) {
	const editor = useEditorRef();
	const table = node as ContentTableNode;
	const columns = table.columns ?? [];
	const pathOf = (): Path | undefined =>
		typeof table.id === "string"
			? editor.api.node({ at: [], match: { id: table.id } })?.[1]
			: editor.api.findPath(table as never);
	const align = (index: number, next: ContentTableColumnAlign) => {
		const path = pathOf();
		if (path !== undefined) {
			editor.tf.setNodes(
				{
					columns: columns.map((column, at) =>
						at === index ? { ...column, align: next } : column,
					),
				} as never,
				{ at: path },
			);
		}
	};
	return (
		<div className="flex flex-col gap-4">
			{columns.map((column, index) => (
				<ColumnAlign
					// The position is the column.
					key={index}
					index={index}
					align={column.align}
					onChange={(next) => align(index, next)}
				/>
			))}
		</div>
	);
}
