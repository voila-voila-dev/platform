import { useId } from "react";
import { BlockOptionRow } from "#/email-block-editor/components/block-options/block-option-row.tsx";
import { Textarea } from "#/textarea/components/textarea.tsx";

interface Props {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	description?: string;
	rows?: number;
}

/** A multi-line text option (a card description, a rating question). */
export function TextAreaOption({
	label,
	value,
	onChange,
	placeholder,
	description,
	rows = 3,
}: Props) {
	const id = useId();
	return (
		<BlockOptionRow label={label} htmlFor={id} description={description}>
			<Textarea
				id={id}
				rows={rows}
				value={value}
				placeholder={placeholder}
				onChange={(event) => onChange(event.target.value)}
			/>
		</BlockOptionRow>
	);
}
