import { useId } from "react";
import { BlockOptionRow } from "#/email-block-editor/components/block-options/block-option-row.tsx";
import { useEmailEditorLabels } from "#/email-block-editor/context/email-editor-context.tsx";
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
export function LinkOption({ label, value, onChange, description }: Props) {
	const { fields } = useEmailEditorLabels();
	const id = useId();
	return (
		<BlockOptionRow
			label={label ?? fields.link}
			htmlFor={id}
			description={description}
		>
			<Input
				id={id}
				type="url"
				placeholder={fields.urlPlaceholder}
				value={value}
				onChange={(event) => onChange(event.target.value)}
			/>
		</BlockOptionRow>
	);
}
