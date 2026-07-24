import { Input } from "@voila.dev/ui/components/input";
import { Textarea } from "@voila.dev/ui/components/textarea";
import { useId } from "react";
import { BlockOptionRow } from "#/sections/block-options/block-option-row.tsx";

/** A single-line text option (a label, a title, a price caption). */
export function TextOption({
	label,
	value,
	onChange,
	placeholder,
	description,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	description?: string;
}) {
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

/** A multi-line text option (a card description, a rating question). */
export function TextAreaOption({
	label,
	value,
	onChange,
	placeholder,
	description,
	rows = 3,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	description?: string;
	rows?: number;
}) {
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
}: {
	label?: string;
	value: string;
	onChange: (href: string) => void;
	description?: string;
}) {
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
