import type { FieldControlProps } from "#/content-editor/components/field-controls/field-control-props.ts";
import { useFieldText } from "#/content-editor/hooks/use-field-text.ts";
import { Input } from "#/input/components/input.tsx";
import { Textarea } from "#/textarea/components/textarea.tsx";

export function TextFieldControl({
	id,
	field,
	value,
	onChange,
}: FieldControlProps<"text">) {
	const text = useFieldText();
	const Control = field.multiline === true ? Textarea : Input;
	return (
		<Control
			id={id}
			value={value}
			placeholder={text(field.placeholder)}
			onChange={(event) => onChange(event.target.value)}
		/>
	);
}
