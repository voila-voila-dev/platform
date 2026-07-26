import type * as React from "react";
import type { Button } from "#/button/components/button.tsx";
import type { Calendar } from "#/calendar/components/calendar.tsx";

export type CalendarPassthrough = Omit<
	React.ComponentProps<typeof Calendar.Root>,
	"mode" | "selected" | "onSelect" | "locale"
>;

/** The props both {@link DatePicker.Root} and `DateRangePicker` take. */
export type DatePickerBase = {
	placeholder?: string;
	/**
	 * `Intl.DateTimeFormat` options for the trigger label. Defaults to a long
	 * localized date (`{ dateStyle: "long" }`, e.g. "June 12, 2026" / "12 juin 2026").
	 */
	formatOptions?: Intl.DateTimeFormatOptions;
	/** BCP-47 locale (e.g. "fr-FR"), applied to both the trigger label and the calendar. */
	locale?: string;
	disabled?: boolean;
	/** Name for the hidden form input(s); value(s) serialized as yyyy-MM-dd. */
	name?: string;
	id?: string;
	className?: string;
	"aria-invalid"?: React.AriaAttributes["aria-invalid"];
	"aria-label"?: string;
	variant?: React.ComponentProps<typeof Button>["variant"];
	/** Escape hatch for the underlying Calendar (disabled days, week numbers…). */
	calendarProps?: CalendarPassthrough;
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
};
