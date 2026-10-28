import type { FieldControlProps } from "#/content-editor/components/field-controls/field-control-props.ts";
import { useFieldText } from "#/content-editor/hooks/use-field-text.ts";
import { Input } from "#/input/components/input.tsx";

export function UrlFieldControl({
	id,
	field,
	value,
	onChange,
}: FieldControlProps<"url">) {
	const text = useFieldText();
	return (
		<Input
			id={id}
			type="url"
			inputMode="url"
			value={value}
			placeholder={text(field.placeholder)}
			onChange={(event) => onChange(event.target.value.trim())}
		/>
	);
}
