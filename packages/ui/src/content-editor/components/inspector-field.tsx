import { type ComponentType, useId } from "react";
import { BooleanFieldControl } from "#/content-editor/components/field-controls/boolean-field-control.tsx";
import type { FieldControlProps } from "#/content-editor/components/field-controls/field-control-props.ts";
import { ImageFieldControl } from "#/content-editor/components/field-controls/image-field-control.tsx";
import { MoneyFieldControl } from "#/content-editor/components/field-controls/money-field-control.tsx";
import { SelectFieldControl } from "#/content-editor/components/field-controls/select-field-control.tsx";
import { StringListFieldControl } from "#/content-editor/components/field-controls/string-list-field-control.tsx";
import { TextFieldControl } from "#/content-editor/components/field-controls/text-field-control.tsx";
import { UrlFieldControl } from "#/content-editor/components/field-controls/url-field-control.tsx";
import type {
	ContentField,
	ContentFieldType,
	ContentFieldValueByType,
} from "#/content-editor/features/field-definition.ts";
import { useFieldText } from "#/content-editor/hooks/use-field-text.ts";
import { Field } from "#/field/components/field.tsx";

const CONTROLS: {
	readonly [Type in ContentFieldType]: ComponentType<FieldControlProps<Type>>;
} = {
	text: TextFieldControl,
	url: UrlFieldControl,
	select: SelectFieldControl,
	boolean: BooleanFieldControl,
	money: MoneyFieldControl,
	image: ImageFieldControl,
	"string-list": StringListFieldControl,
};

/** What a field shows when the node was stored without the attribute. */
const EMPTY: {
	readonly [Type in ContentFieldType]: (
		field: Extract<ContentField, { readonly type: Type }>,
	) => ContentFieldValueByType[Type];
} = {
	text: () => "",
	url: () => "",
	select: (field) => field.options[0]?.value ?? "",
	boolean: () => false,
	money: (field) => ({
		amountInMinorUnits: 0,
		currency: field.currencies?.[0] ?? "EUR",
	}),
	image: () => "",
	"string-list": () => [],
};

interface Props {
	readonly field: ContentField;
	readonly value: unknown;
	readonly onChange: (value: unknown) => void;
}

/** One field: its label, its control, its description. */
export function InspectorField({ field, value, onChange }: Props) {
	const id = useId();
	const text = useFieldText();
	// The table is total over the field types; TypeScript cannot correlate
	// `field.type` with the control it picks, so the pair is widened once here.
	const Control = CONTROLS[field.type] as ComponentType<
		FieldControlProps<ContentFieldType>
	>;
	const empty = EMPTY[field.type] as (field: ContentField) => unknown;
	const control = (
		<Control
			id={id}
			field={field as never}
			value={(value ?? empty(field)) as never}
			onChange={onChange}
		/>
	);
	const label = <Field.Label htmlFor={id}>{text(field.label)}</Field.Label>;
	const description =
		field.description === undefined ? null : (
			<Field.Description>{text(field.description)}</Field.Description>
		);

	if (field.type === "boolean") {
		return (
			<Field.Root orientation="horizontal">
				<Field.Content className="flex-1">
					{label}
					{description}
				</Field.Content>
				{control}
			</Field.Root>
		);
	}
	return (
		<Field.Root>
			{label}
			{control}
			{description}
		</Field.Root>
	);
}
