import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { InputGroup } from "#/input-group/components/input-group.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof InputGroup.Input> {}

/**
 * Search emplacement for the toolbar - a leading-icon search input. Controlled
 * like a plain input (`value`/`onChange`); debouncing and where the filtering
 * happens (client or server) stay with the consumer. `className` sizes the
 * group; all other props go to the input itself.
 */
export function DataTableSearch({ className, ...props }: Props) {
	return (
		<InputGroup.Root
			data-slot="data-table-search"
			className={cn("w-full sm:w-64", className)}
		>
			<InputGroup.Input type="search" {...props} />
			<InputGroup.Addon>
				<MagnifyingGlassIcon />
			</InputGroup.Addon>
		</InputGroup.Root>
	);
}
