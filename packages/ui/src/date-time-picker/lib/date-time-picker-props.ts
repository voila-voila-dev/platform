import type * as React from "react";

/** The value and field props every datetime surface in this family accepts. */
export type DateTimeShared = {
	/** Controlled value; pass `null` for a controlled empty selection. */
	value?: Date | null;
	defaultValue?: Date;
	onValueChange?: (date: Date | null) => void;
	placeholder?: string;
	/** BCP-47 locale (e.g. "fr-FR"), applied to the trigger label, calendar, and time labels. */
	locale?: string;
	disabled?: boolean;
	/** Name for a hidden form input; the value is serialized as `yyyy-MM-ddTHH:mm`. */
	name?: string;
	id?: string;
	className?: string;
	"aria-invalid"?: React.AriaAttributes["aria-invalid"];
	"aria-label"?: string;
	/** Minutes between two options in the time list. Defaults to 30. */
	minuteStep?: number;
};
