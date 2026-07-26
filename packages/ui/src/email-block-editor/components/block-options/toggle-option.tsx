import { useId } from "react";
import { BlockOptionRow } from "#/email-block-editor/components/block-options/block-option-row.tsx";
import { Switch } from "#/switch/components/switch.tsx";

interface Props {
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
	description?: string;
}

/** The one boolean control: a switch beside its label, description below. */
export function ToggleOption({ label, checked, onChange, description }: Props) {
	const id = useId();
	return (
		<BlockOptionRow
			label={label}
			htmlFor={id}
			description={description}
			orientation="horizontal"
		>
			<Switch id={id} checked={checked} onCheckedChange={onChange} />
		</BlockOptionRow>
	);
}
