import type * as React from "react";
import { InputGroup } from "#/input-group/components/input-group.tsx";

interface Props
	extends Omit<React.ComponentProps<typeof InputGroup.Input>, "onChange"> {
	onChange: (raw: string) => void;
	/** Rendered as a trailing addon, e.g. `km` or `€`. */
	unit?: string;
}

export function NumberField({ onChange, unit, ...props }: Props) {
	return (
		<InputGroup.Root data-slot="filter-number-field">
			<InputGroup.Input
				type="number"
				inputMode="decimal"
				onChange={(event) => onChange(event.target.value)}
				{...props}
			/>
			{unit !== undefined && (
				<InputGroup.Addon align="inline-end">{unit}</InputGroup.Addon>
			)}
		</InputGroup.Root>
	);
}
