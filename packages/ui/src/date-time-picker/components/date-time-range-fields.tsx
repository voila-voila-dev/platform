import type * as React from "react";
import type { ResponsiveDateTimeInput } from "#/date-time-picker/components/responsive-date-time-input.tsx";
import {
	type DateTimeRange,
	endFieldBounds,
	resolveEndFieldId,
	useDateTimeRangeState,
} from "#/date-time-picker/lib/date-time-range.ts";
import { Label } from "#/label/components/label.tsx";
import { cn } from "#/lib/utils.ts";

/**
 * What the range layout needs from the single-instant field it lays out. The
 * popover, native and responsive inputs all accept this shape (the native one
 * through an adapter that drops what it has no use for), which is what lets one
 * layout drive all three range surfaces.
 */
export type InstantField = React.ComponentType<
	Pick<
		React.ComponentProps<typeof ResponsiveDateTimeInput>,
		| "id"
		| "value"
		| "onValueChange"
		| "placeholder"
		| "locale"
		| "disabled"
		| "minuteStep"
		| "formatOptions"
		| "min"
		| "calendarProps"
		| "aria-invalid"
		| "className"
	>
>;

export interface DateTimeRangeFieldsProps {
	/** Controlled range; both sides may be `null` independently. */
	value?: DateTimeRange;
	/** Initial range when uncontrolled. */
	defaultValue?: DateTimeRange;
	/** Called with the whole `{ start, end }` after either side changes. */
	onValueChange?: (range: DateTimeRange) => void;
	/** Label above the start field. Defaults to "Start". */
	startLabel?: React.ReactNode;
	/** Label above the end field. Defaults to "End". */
	endLabel?: React.ReactNode;
	/** Placeholder for the start field while it is empty. */
	startPlaceholder?: string;
	/** Placeholder for the end field while it is empty. */
	endPlaceholder?: string;
	/** id for the start field; the end field derives `${startId}-end` when `endId` is omitted. */
	startId?: string;
	/** id for the end field. Derived from `startId` when omitted. */
	endId?: string;
	/** BCP-47 locale (e.g. "fr-FR"), applied to both fields' labels, calendars, and time lists. */
	locale?: string;
	/** Blocks both fields. */
	disabled?: boolean;
	/** Minutes between two options in each time list. Defaults to 30. */
	minuteStep?: number;
	/**
	 * Duration (minutes) used to seed the end when a start is picked while the end
	 * is still empty, and to push the end forward when a new start lands on or past
	 * it, so the range stays valid without extra clicks. Defaults to 60.
	 */
	defaultDurationMinutes?: number;
	/** `Intl.DateTimeFormat` options for the desktop trigger labels. */
	formatOptions?: Intl.DateTimeFormatOptions;
	/** Styles the wrapping grid (e.g. `md:col-span-2`). */
	className?: string;
	/** Marks both fields invalid. Pair it with your own message. */
	"aria-invalid"?: React.AriaAttributes["aria-invalid"];
}

/**
 * Two labeled instant fields bound into a single start/end range.
 * Picking a start seeds (or nudges) the end so the span stays valid, and the end
 * field is bounded to never fall before the start (its calendar disables earlier
 * days and the native input carries a `min`). Every surface speaks one
 * `{ start, end }` value model, so callers never juggle datetime strings.
 *
 * This is the layout only: `Field` decides which surface the two sides render.
 */
export function DateTimeRangeFields({
	Field,
	slot,
	value: controlledValue,
	defaultValue,
	onValueChange,
	startLabel = "Start",
	endLabel = "End",
	startPlaceholder,
	endPlaceholder,
	startId,
	endId,
	locale,
	disabled,
	minuteStep,
	defaultDurationMinutes = 60,
	formatOptions,
	className,
	"aria-invalid": ariaInvalid,
}: DateTimeRangeFieldsProps & { Field: InstantField; slot: string }) {
	const { range, commit } = useDateTimeRangeState({
		value: controlledValue,
		defaultValue,
		onValueChange,
	});

	const handleStartChange = (start: Date | null) => {
		let end = range.end;
		if (start !== null && (end === null || end.getTime() <= start.getTime())) {
			end = new Date(start.getTime() + defaultDurationMinutes * 60_000);
		}
		commit({ start, end });
	};

	const handleEndChange = (end: Date | null) => {
		commit({ start: range.start, end });
	};

	const resolvedEndId = resolveEndFieldId(startId, endId);
	const endBounds = endFieldBounds(range.start);

	return (
		<div
			data-slot={slot}
			className={cn(
				"@container/date-time-range grid grid-cols-1 gap-3 @lg/date-time-range:grid-cols-2",
				className,
			)}
		>
			<div className="flex min-w-0 flex-col gap-1.5">
				<Label htmlFor={startId}>{startLabel}</Label>
				<Field
					id={startId}
					value={range.start}
					onValueChange={handleStartChange}
					placeholder={startPlaceholder}
					locale={locale}
					disabled={disabled}
					minuteStep={minuteStep}
					formatOptions={formatOptions}
					aria-invalid={ariaInvalid}
					className="w-full min-w-0"
				/>
			</div>
			<div className="flex min-w-0 flex-col gap-1.5">
				<Label htmlFor={resolvedEndId}>{endLabel}</Label>
				<Field
					id={resolvedEndId}
					value={range.end}
					onValueChange={handleEndChange}
					placeholder={endPlaceholder}
					locale={locale}
					disabled={disabled}
					minuteStep={minuteStep}
					formatOptions={formatOptions}
					min={endBounds.min}
					calendarProps={endBounds.calendarProps}
					aria-invalid={ariaInvalid}
				/>
			</div>
		</div>
	);
}
