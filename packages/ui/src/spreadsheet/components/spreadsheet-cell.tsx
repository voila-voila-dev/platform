import * as React from "react";
import { cn } from "#/lib/utils.ts";
import { SpreadsheetContext } from "#/spreadsheet/context/spreadsheet-context.ts";
import { controlCellClassName } from "#/spreadsheet/lib/spreadsheet-styles.ts";

interface Props extends React.ComponentProps<"td"> {
	/**
	 * What `gridNavigation` copy serializes for this cell instead of the inner
	 * control's DOM value - required for controls whose DOM value isn't the
	 * data (Checkbox, Switch), useful whenever the copied text should differ
	 * from what the control displays.
	 */
	value?: string;
}

/**
 * Hosts exactly one form control. Clicking the cell's empty space forwards
 * focus to the control (or, under `gridNavigation`, to the cell itself); a
 * consumer `onClick` runs first and can cancel the forwarding with
 * `event.preventDefault()`. Clicks landing on interactive content
 * (Checkbox/Switch render `<button>`s) are left alone.
 */
export function SpreadsheetCell({
	className,
	onClick,
	value,
	...props
}: Props) {
	const { gridNavigation } = React.useContext(SpreadsheetContext);
	return (
		<td
			data-slot="spreadsheet-cell"
			data-grid-value={value}
			className={cn(controlCellClassName, className)}
			onClick={(event) => {
				onClick?.(event);
				if (event.defaultPrevented) {
					return;
				}
				const target = event.target as HTMLElement;
				if (target.closest("button, a, input, select, textarea, label")) {
					return;
				}
				if (gridNavigation) {
					// Navigation mode owns plain clicks; editing starts from the
					// control itself, Enter, F2 or typing.
					event.currentTarget.focus();
					return;
				}
				event.currentTarget
					.querySelector<HTMLElement>(
						"input, select, textarea, button, [tabindex]",
					)
					?.focus();
			}}
			{...props}
		/>
	);
}
