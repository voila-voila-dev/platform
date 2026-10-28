import type * as React from "react";

/** The value and field props every datetime surface in this family accepts. */
export type DateTimeShared = {
	/** Controlled value; pass `null` for a controlled empty selection. */
	value?: Date | null;
	/** Initial value when uncontrolled. */
	defaultValue?: Date;
	/**
	 * Called with the combined datetime, or `null` when cleared. Picking a day
	 * before any time exists fills the time in at 09:00 rather than emitting a
	 * date at midnight.
	 */
	onValueChange?: (date: Date | null) => void;
	/** Shown on the trigger while nothing is selected. Name the field. */
	placeholder?: string;
	/** BCP-47 locale (e.g. "fr-FR"), applied to the trigger label, calendar, and time labels. */
	locale?: string;
	/** Blocks the field, so neither surface can be opened. */
	disabled?: boolean;
	/** Name for a hidden form input; the value is serialized as `yyyy-MM-ddTHH:mm`. */
	name?: string;
	/** Ties the field to a `<label>`. Pass it when there is a visible label. */
	id?: string;
	/** Classes for the field. Both surfaces fill their container by default. */
	className?: string;
	/** Marks the field invalid. Pair it with your own message — this draws no text. */
	"aria-invalid"?: React.AriaAttributes["aria-invalid"];
	/** Accessible name, for when there is no visible label to point `id` at. */
	"aria-label"?: string;
	/** Minutes between two options in the time list. Defaults to 30. */
	minuteStep?: number;
};
