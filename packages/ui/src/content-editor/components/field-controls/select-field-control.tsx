import type { FieldControlProps } from "#/content-editor/components/field-controls/field-control-props.ts";
import { useFieldText } from "#/content-editor/hooks/use-field-text.ts";
import { Select } from "#/select/components/select.tsx";

export function SelectFieldControl({
	id,
	field,
	value,
	onChange,
}: FieldControlProps<"select">) {
	const text = useFieldText();
	// The kit's select takes strings; a count is stored as the number it is.
	const items = field.options.map((option) => ({
		value: String(option.value),
		label: text(option.label),
	}));
	return (
		<Select.Root
			items={items}
			value={String(value)}
			onValueChange={(next) => {
				const option = field.options.find(
					(candidate) => String(candidate.value) === next,
				);
				if (option !== undefined) {
					onChange(option.value);
				}
			}}
		>
			<Select.Trigger id={id} className="w-full">
				<Select.Value />
			</Select.Trigger>
			<Select.Content>
				{items.map((item) => (
					<Select.Item key={item.value} value={item.value}>
						{item.label}
					</Select.Item>
				))}
			</Select.Content>
		</Select.Root>
	);
}
