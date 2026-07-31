import { RowsIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { Button } from "#/button/components/button.tsx";
import type { DataTableDensity } from "#/data-table/lib/density.ts";
import { DropdownMenu } from "#/dropdown-menu/components/dropdown-menu.tsx";

interface Props extends Omit<React.ComponentProps<typeof Button>, "onChange"> {
	/** The current row height. Controlled — this toggle holds no state. */
	density: DataTableDensity;
	/** Called with the picked density. Pass the same value to `DataTable.Root`. */
	onDensityChange: (density: DataTableDensity) => void;
	/** Text on the trigger. This package ships no translations. */
	label?: string;
	/** Names for the two options, as shown in the menu. */
	labels?: Record<DataTableDensity, string>;
}

/** Row-height switch, for tables people scan rather than read. */
export function DataTableDensityToggle({
	density,
	onDensityChange,
	label = "Density",
	labels = { comfortable: "Comfortable", compact: "Compact" },
	...props
}: Props) {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				render={
					<Button
						variant="outline"
						size="sm"
						data-slot="data-table-density-toggle"
						{...props}
					>
						<RowsIcon />
						{label}
					</Button>
				}
			/>
			<DropdownMenu.Content align="end">
				<DropdownMenu.RadioGroup
					value={density}
					onValueChange={(value) => onDensityChange(value as DataTableDensity)}
				>
					<DropdownMenu.RadioItem value="comfortable">
						{labels.comfortable}
					</DropdownMenu.RadioItem>
					<DropdownMenu.RadioItem value="compact">
						{labels.compact}
					</DropdownMenu.RadioItem>
				</DropdownMenu.RadioGroup>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
