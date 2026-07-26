import { useId } from "react";
import { BlockOptionRow } from "#/email-block-editor/components/block-options/block-option-row.tsx";
import { NativeSelect } from "#/native-select/components/native-select.tsx";

interface Props<Value extends string | number> {
	label: string;
	value: Value;
	options: ReadonlyArray<{ readonly value: Value; readonly label: string }>;
	onChange: (value: Value) => void;
	description?: string;
}

/**
 * The one control for a small closed choice — the admin-form default in this
 * repo. Option values may be numbers (a heading level); they are matched back
 * by their string form, so the callback still receives the typed value.
 */
export function SelectOption<Value extends string | number>({
	label,
	value,
	options,
	onChange,
	description,
}: Props<Value>) {
	const id = useId();
	return (
		<BlockOptionRow label={label} htmlFor={id} description={description}>
			<NativeSelect.Root
				id={id}
				size="sm"
				value={String(value)}
				onChange={(event) => {
					const picked = options.find(
						(option) => String(option.value) === event.target.value,
					);
					if (picked !== undefined) {
						onChange(picked.value);
					}
				}}
			>
				{options.map((option) => (
					<NativeSelect.Option key={String(option.value)} value={option.value}>
						{option.label}
					</NativeSelect.Option>
				))}
			</NativeSelect.Root>
		</BlockOptionRow>
	);
}
