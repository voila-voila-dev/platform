import {
	NativeSelect,
	NativeSelectOption,
} from "@voila.dev/ui/components/native-select";
import { Switch } from "@voila.dev/ui/components/switch";
import { useId } from "react";
import { BlockOptionRow } from "#/sections/block-options/block-option-row.tsx";

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
}: {
	label: string;
	value: Value;
	options: ReadonlyArray<{ readonly value: Value; readonly label: string }>;
	onChange: (value: Value) => void;
	description?: string;
}) {
	const id = useId();
	return (
		<BlockOptionRow label={label} htmlFor={id} description={description}>
			<NativeSelect
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
					<NativeSelectOption key={String(option.value)} value={option.value}>
						{option.label}
					</NativeSelectOption>
				))}
			</NativeSelect>
		</BlockOptionRow>
	);
}

/** The one boolean control: a switch beside its label, description below. */
export function ToggleOption({
	label,
	checked,
	onChange,
	description,
}: {
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
	description?: string;
}) {
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
