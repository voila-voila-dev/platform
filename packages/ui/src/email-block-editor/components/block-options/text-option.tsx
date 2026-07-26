import { useId } from "react";
import { BlockOptionRow } from "#/email-block-editor/components/block-options/block-option-row.tsx";
import { Input } from "#/input/components/input.tsx";

interface Props {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	description?: string;
}

/** A single-line text option (a label, a title, a price caption). */
export function TextOption({
	label,
	value,
	onChange,
	placeholder,
	description,
}: Props) {
	const id = useId();
	return (
		<BlockOptionRow label={label} htmlFor={id} description={description}>
			<Input
				id={id}
				value={value}
				placeholder={placeholder}
				onChange={(event) => onChange(event.target.value)}
			/>
		</BlockOptionRow>
	);
}
