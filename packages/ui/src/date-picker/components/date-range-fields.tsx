import type * as React from "react";
import type { DateRange } from "react-day-picker";
import type { NativeDateInput } from "#/date-picker/components/native-date-input.tsx";
import {
	resolveToFieldId,
	useDateRangeState,
} from "#/date-picker/lib/date-range-state.ts";
import { Label } from "#/label/components/label.tsx";
import { cn } from "#/lib/utils.ts";

/**
 * What both range field pairs need from the single-day field they lay out. The
 * native and responsive inputs share this shape, which is what lets one layout
 * drive both.
 */
type DayField = React.ComponentType<
	Pick<
		React.ComponentProps<typeof NativeDateInput>,
		| "id"
		| "name"
		| "value"
		| "onValueChange"
		| "min"
		| "max"
		| "disabled"
		| "aria-invalid"
	> & { placeholder?: string; locale?: string; className?: string }
>;

export interface DateRangeFieldsProps {
	/** Controlled range; pass `null` for a controlled empty selection. */
	value?: DateRange | null;
	/** Initial range when uncontrolled. */
	defaultValue?: DateRange;
	/** Called with the whole `{ from, to }` after either side changes. */
	onValueChange?: (range: DateRange) => void;
	/** Label above the start field. Defaults to "From". */
	fromLabel?: React.ReactNode;
	/** Label above the end field. Defaults to "To". */
	toLabel?: React.ReactNode;
	/** Placeholder for the start field while it is empty. */
	fromPlaceholder?: string;
	/** Placeholder for the end field while it is empty. */
	toPlaceholder?: string;
	/** id for the start field; the end field derives `${fromId}-to` when `toId` is omitted. */
	fromId?: string;
	/** id for the end field. Derived from `fromId` when omitted. */
	toId?: string;
	/** Names for the hidden form inputs: `${name}-from` and `${name}-to`. */
	name?: string;
	/** BCP-47 locale (e.g. "fr-FR"), applied to both fields. */
	locale?: string;
	/** Blocks both fields. */
	disabled?: boolean;
	/** Earliest day either side may take. */
	min?: Date;
	/** Latest day either side may take. */
	max?: Date;
	/** Styles the wrapping grid (e.g. `md:col-span-2`). */
	className?: string;
	/** Marks both fields invalid. Pair it with your own message. */
	"aria-invalid"?: React.AriaAttributes["aria-invalid"];
}

/**
 * Two labeled day fields bound into one `{ from, to }` range. The end can never
 * fall before the start — it carries the start as its own `min` — and picking a
 * start past the current end clears that end rather than leaving an inverted
 * range on screen.
 *
 * This is the layout only: `Field` decides which surface the two sides render,
 * which is what separates {@link DatePicker.NativeRange} from
 * {@link DatePicker.ResponsiveRange}.
 */
export function DateRangeFields({
	Field,
	slot,
	value: controlledValue,
	defaultValue,
	onValueChange,
	fromLabel = "From",
	toLabel = "To",
	fromPlaceholder,
	toPlaceholder,
	fromId,
	toId,
	name,
	locale,
	disabled,
	min,
	max,
	className,
	"aria-invalid": ariaInvalid,
}: DateRangeFieldsProps & { Field: DayField; slot: string }) {
	const { range, commit } = useDateRangeState({
		value: controlledValue,
		defaultValue,
		onValueChange,
	});

	const handleFromChange = (from: Date | null) => {
		const to =
			from !== null &&
			range.to !== undefined &&
			range.to.getTime() < from.getTime()
				? undefined
				: range.to;
		commit({ from: from ?? undefined, to });
	};

	const resolvedToId = resolveToFieldId(fromId, toId);

	return (
		<div
			data-slot={slot}
			className={cn(
				"@container/date-range grid grid-cols-1 gap-3 @md/date-range:grid-cols-2",
				className,
			)}
		>
			<div className="flex min-w-0 flex-col gap-1.5">
				<Label htmlFor={fromId}>{fromLabel}</Label>
				<Field
					id={fromId}
					name={name ? `${name}-from` : undefined}
					value={range.from ?? null}
					onValueChange={handleFromChange}
					placeholder={fromPlaceholder}
					locale={locale}
					disabled={disabled}
					min={min}
					max={range.to ?? max}
					aria-invalid={ariaInvalid}
					className="w-full min-w-0"
				/>
			</div>
			<div className="flex min-w-0 flex-col gap-1.5">
				<Label htmlFor={resolvedToId}>{toLabel}</Label>
				<Field
					id={resolvedToId}
					name={name ? `${name}-to` : undefined}
					value={range.to ?? null}
					onValueChange={(to) =>
						commit({ from: range.from, to: to ?? undefined })
					}
					placeholder={toPlaceholder}
					locale={locale}
					disabled={disabled}
					min={range.from ?? min}
					max={max}
					aria-invalid={ariaInvalid}
					className="w-full min-w-0"
				/>
			</div>
		</div>
	);
}
