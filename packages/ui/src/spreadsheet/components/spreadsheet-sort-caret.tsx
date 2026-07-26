import {
	CaretDownIcon,
	CaretUpDownIcon,
	CaretUpIcon,
} from "@phosphor-icons/react";
import type { SpreadsheetSortDirection } from "#/spreadsheet/context/spreadsheet-context.ts";

interface Props {
	direction: SpreadsheetSortDirection | undefined;
}

/** The sort affordance in a header cell. */
export function SpreadsheetSortCaret({ direction }: Props) {
	if (direction === "asc") {
		return <CaretUpIcon className="size-3.5 shrink-0" />;
	}
	if (direction === "desc") {
		return <CaretDownIcon className="size-3.5 shrink-0" />;
	}
	return (
		<CaretUpDownIcon className="size-3.5 shrink-0 text-muted-foreground/50" />
	);
}
