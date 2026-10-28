import {
	CaretDownIcon,
	CaretUpDownIcon,
	CaretUpIcon,
} from "@phosphor-icons/react";
import type { SortDirection } from "@tanstack/react-table";

interface Props {
	canSort: boolean;
	sorted: false | SortDirection;
}

/** The sort affordance in a header cell: direction, or a hint that it sorts. */
export function DataTableSortCaret({ canSort, sorted }: Props) {
	if (sorted === "asc") {
		return <CaretUpIcon className="size-3.5 shrink-0" />;
	}
	if (sorted === "desc") {
		return <CaretDownIcon className="size-3.5 shrink-0" />;
	}
	if (canSort) {
		return (
			<CaretUpDownIcon className="size-3.5 shrink-0 text-muted-foreground/50" />
		);
	}
	return null;
}
