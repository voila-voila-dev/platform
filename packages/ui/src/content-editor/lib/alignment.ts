import type { ContentSelectField } from "#/content-editor/features/field-definition.ts";
import { escapeHtml } from "#/content-editor/reader/escape-html.ts";

/** The email blocks' alignment, the values the email block editor stored. */
export type ContentAlignment = "left" | "center" | "right";

/** The inspector's alignment select, shared by every block that aligns. */
export const alignmentField: ContentSelectField<"align", ContentAlignment> = {
	type: "select",
	key: "align",
	label: "align",
	options: [
		{ value: "left", label: "alignLeft" },
		{ value: "center", label: "alignCenter" },
		{ value: "right", label: "alignRight" },
	],
};

/** Flexbox equivalents of the email's `align` attribute. */
export const JUSTIFY: { readonly [A in ContentAlignment]: string } = {
	left: "flex-start",
	center: "center",
	right: "flex-end",
};

/** `style="text-align:…"`, for the web HTML of an aligned block. */
export function alignStyleAttribute(align: ContentAlignment): string {
	return ` style="text-align:${escapeHtml(align)}"`;
}
