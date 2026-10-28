import type * as React from "react";
import type { Button } from "#/button/components/button.tsx";
import type { Calendar } from "#/calendar/components/calendar.tsx";

export type CalendarPassthrough = Omit<
	React.ComponentProps<typeof Calendar.Root>,
	"mode" | "selected" | "onSelect" | "locale"
>;

/** The props both {@link DatePicker.Root} and `DateRangePicker` take. */
export type DatePickerBase = {
	/** Shown on the trigger while nothing is selected. Name the field, don't say "Pick a date". */
	placeholder?: string;
	/**
	 * `Intl.DateTimeFormat` options for the trigger label. Defaults to a long
	 * localized date (`{ dateStyle: "long" }`, e.g. "June 12, 2026" / "12 juin 2026").
	 */
	formatOptions?: Intl.DateTimeFormatOptions;
	/** BCP-47 locale (e.g. "fr-FR"), applied to both the trigger label and the calendar. */
	locale?: string;
	/** Blocks the trigger, so the popover cannot be opened. */
	disabled?: boolean;
	/** Name for the hidden form input(s); value(s) serialized as yyyy-MM-dd. */
	name?: string;
	/** Ties the trigger to a `<label>`. Pass it when the field has a visible label. */
	id?: string;
	/** Classes for the trigger. The popover is styled through `calendarProps`. */
	className?: string;
	/** Marks the trigger invalid. Pair it with your own message — this draws no text. */
	"aria-invalid"?: React.AriaAttributes["aria-invalid"];
	/** Accessible name, for when there is no visible label to point `id` at. */
	"aria-label"?: string;
	/** Button variant for the trigger. `outline` is the field-shaped default. */
	variant?: React.ComponentProps<typeof Button>["variant"];
	/** Escape hatch for the underlying Calendar (disabled days, week numbers…). */
	calendarProps?: CalendarPassthrough;
	/** Whether the popover starts open. Uncontrolled — for the controlled form use `open`. */
	defaultOpen?: boolean;
	/** Controlled popover state. Pair it with `onOpenChange`. */
	open?: boolean;
	/** Called when the popover opens or closes, including on selection and on dismiss. */
	onOpenChange?: (open: boolean) => void;
};
