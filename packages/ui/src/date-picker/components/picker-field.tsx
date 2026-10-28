import type * as React from "react";

/**
 * The input-look a picker trigger wears, split from the trigger itself so the
 * surfaces that cannot use `Popover.Trigger` — the shift picker's drawer, on a
 * phone — still look like the same field rather than a Button someone styled
 * to resemble one.
 */
export const PICKER_FIELD_CLASSES =
	"min-w-48 justify-start text-start font-normal data-empty:text-muted-foreground";

/** Leading icon plus the label, truncated so a long date cannot widen the field. */
export function PickerFieldContent({
	icon,
	children,
}: {
	icon: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<>
			{icon}
			<span className="truncate">{children}</span>
		</>
	);
}
