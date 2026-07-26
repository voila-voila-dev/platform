import { useId } from "react";
import { BlockOptionRow } from "#/email-block-editor/components/block-options/block-option-row.tsx";
import { Input } from "#/input/components/input.tsx";

interface Props {
	label?: string;
	value: string;
	onChange: (href: string) => void;
	description?: string;
}

/**
 * The one destination-URL control. Always "Link (URL)", always
 * `type="url"` with the `https://` placeholder, so a link field is
 * recognisable at a glance in any block (§1.2 of the editor plan).
 */
export function LinkOption({
	label = "Link (URL)",
	value,
	onChange,
	description,
}: Props) {
	const id = useId();
	return (
		<BlockOptionRow label={label} htmlFor={id} description={description}>
			<Input
				id={id}
				type="url"
				placeholder="https://"
				value={value}
				onChange={(event) => onChange(event.target.value)}
			/>
		</BlockOptionRow>
	);
}
