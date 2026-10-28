import { FieldContent } from "#/field/components/field-content.tsx";
import { FieldDescription } from "#/field/components/field-description.tsx";
import { FieldError } from "#/field/components/field-error.tsx";
import { FieldGroup } from "#/field/components/field-group.tsx";
import { FieldLabel } from "#/field/components/field-label.tsx";
import { FieldLegend } from "#/field/components/field-legend.tsx";
import { FieldRoot } from "#/field/components/field-root.tsx";
import { FieldSeparator } from "#/field/components/field-separator.tsx";
import { FieldSet } from "#/field/components/field-set.tsx";
import { FieldTitle } from "#/field/components/field-title.tsx";

/**
 * The Field parts as one namespace.
 */
export const Field = {
	Root: FieldRoot,
	Content: FieldContent,
	Description: FieldDescription,
	Error: FieldError,
	Group: FieldGroup,
	Label: FieldLabel,
	Legend: FieldLegend,
	Separator: FieldSeparator,
	Set: FieldSet,
	Title: FieldTitle,
};
