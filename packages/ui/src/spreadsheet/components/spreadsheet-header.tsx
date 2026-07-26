import * as React from "react";
import { cn } from "#/lib/utils.ts";
import { SpreadsheetContext } from "#/spreadsheet/context/spreadsheet-context.ts";

interface Props extends React.ComponentProps<"thead"> {}

/** The header row band — sticky when the table asks for it. */
export function SpreadsheetHeader({ className, ...props }: Props) {
	const { stickyHeader } = React.useContext(SpreadsheetContext);
	return (
		<thead
			data-slot="spreadsheet-header"
			className={cn(
				"bg-muted/50",
				// Collapsed borders don't travel with a sticky thead, so the bottom
				// rule is redrawn as an inset shadow and the header cells drop their
				// own border-b. The translucent tint also goes opaque: scrolled rows
				// would show through `bg-muted/50`.
				stickyHeader &&
					"sticky top-0 z-10 bg-background shadow-[inset_0_-1px_0_0_var(--color-border)] [&_th]:border-b-0",
				className,
			)}
			{...props}
		/>
	);
}
