import { CalendarBlankIcon } from "@phosphor-icons/react";
import type * as React from "react";
import type { DateRange } from "react-day-picker";
import { Button, type ButtonProps } from "#/components/ui/button.tsx";
import { Calendar } from "#/components/ui/calendar.tsx";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/ui/popover.tsx";
import { usePickerState } from "#/hooks/use-picker-state.ts";
import { cn } from "#/lib/utils.ts";

type CalendarPassthroughProps = Omit<
	React.ComponentProps<typeof Calendar>,
	"mode" | "selected" | "onSelect" | "locale"
>;

/** Long localized date for the trigger label (e.g. "June 12, 2026" / "12 juin 2026"). */
const DEFAULT_DATE_FORMAT: Intl.DateTimeFormatOptions = { dateStyle: "long" };

/** Local `yyyy-MM-dd` for the hidden form input — the shape a `<input type=date>` wants. */
function toIsoDay(date: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}

type DatePickerBaseProps = {
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
	variant?: ButtonProps["variant"];
	/** Escape hatch for the underlying Calendar (disabled days, week numbers…). */
	calendarProps?: CalendarPassthroughProps;
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
};

/**
 * The shared input-look trigger for the popover pickers (DatePicker,
 * DateRangePicker, TimePicker): leading icon + label or muted placeholder.
 */
function DatePickerTrigger({
	className,
	empty,
	children,
	// An explicit `variant: undefined` in the spread would override the inner
	// Button's JSX default, so the fallback must live here.
	variant = "outline",
	icon = (
		<CalendarBlankIcon className="size-4 shrink-0 text-muted-foreground" />
	),
	slot = "date-picker-trigger",
	...props
}: ButtonProps & { empty: boolean; icon?: React.ReactNode; slot?: string }) {
	return (
		<PopoverTrigger
			data-slot={slot}
			data-empty={empty || undefined}
			render={
				<Button
					variant={variant}
					className={cn(
						"min-w-48 justify-start text-start font-normal data-empty:text-muted-foreground",
						className,
					)}
					{...props}
				/>
			}
		>
			{icon}
			<span className="truncate">{children}</span>
		</PopoverTrigger>
	);
}

function DatePickerHiddenInput({
	name,
	date,
}: {
	name?: string;
	date: Date | null | undefined;
}) {
	if (!name) return null;
	return <input type="hidden" name={name} value={date ? toIsoDay(date) : ""} />;
}

function DatePickerContent({ children }: { children: React.ReactNode }) {
	return (
		<PopoverContent
			data-slot="date-picker-content"
			className="w-auto p-0"
			align="start"
		>
			{children}
		</PopoverContent>
	);
}

function formatDateLabel(
	value: Date | null | undefined,
	locale: string | undefined,
	formatOptions: Intl.DateTimeFormatOptions,
	placeholder: string,
): string {
	if (!value) {
		return placeholder;
	}
	return new Intl.DateTimeFormat(locale, formatOptions).format(value);
}

function DatePicker({
	value: controlledValue,
	defaultValue,
	onValueChange,
	placeholder = "Pick a date",
	formatOptions = DEFAULT_DATE_FORMAT,
	locale,
	disabled = false,
	name,
	id,
	className,
	"aria-invalid": ariaInvalid,
	"aria-label": ariaLabel,
	variant,
	calendarProps,
	defaultOpen,
	open: controlledOpen,
	onOpenChange,
}: DatePickerBaseProps & {
	/** Controlled value; pass `null` for a controlled empty selection. */
	value?: Date | null;
	defaultValue?: Date;
	onValueChange?: (date: Date | null) => void;
}) {
	const { isControlled, value, setUncontrolledValue, open, setOpen } =
		usePickerState<Date>({
			value: controlledValue,
			defaultValue,
			open: controlledOpen,
			defaultOpen,
			onOpenChange,
		});

	const handleSelect = (date: Date | undefined) => {
		if (!isControlled) setUncontrolledValue(date);
		onValueChange?.(date ?? null);
		// Single selection is complete the moment a day is picked.
		if (date) setOpen(false);
	};

	const selectedDate = value ?? undefined;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<DatePickerTrigger
				id={id}
				className={className}
				disabled={disabled}
				empty={!value}
				aria-invalid={ariaInvalid}
				aria-label={ariaLabel}
				variant={variant}
			>
				{formatDateLabel(value, locale, formatOptions, placeholder)}
			</DatePickerTrigger>
			<DatePickerHiddenInput name={name} date={value} />
			<DatePickerContent>
				<Calendar
					mode="single"
					selected={selectedDate}
					onSelect={handleSelect}
					defaultMonth={selectedDate}
					locale={locale}
					autoFocus
					{...calendarProps}
				/>
			</DatePickerContent>
		</Popover>
	);
}

// A range is complete once both ends differ; the first click yields
// from === to, which must keep the popover open for the second click.
function isRangeSelectionComplete(range: DateRange | undefined): boolean {
	if (!range?.from || !range.to) {
		return false;
	}
	return range.from.getTime() !== range.to.getTime();
}

// A same-day range (also the intermediate state after the first click)
// collapses to a single date instead of "June 9 – June 9".
function formatDateRangeLabel(
	value: DateRange | null | undefined,
	locale: string | undefined,
	formatOptions: Intl.DateTimeFormatOptions,
	placeholder: string,
): string {
	if (!value?.from) {
		return placeholder;
	}
	const dateFormat = new Intl.DateTimeFormat(locale, formatOptions);
	if (!value.to || value.to.getTime() === value.from.getTime()) {
		return dateFormat.format(value.from);
	}
	return `${dateFormat.format(value.from)} – ${dateFormat.format(value.to)}`;
}

function DateRangePickerHiddenInputs({
	name,
	value,
}: {
	name?: string;
	value: DateRange | null | undefined;
}) {
	if (!name) {
		return null;
	}
	return (
		<>
			<DatePickerHiddenInput name={`${name}-from`} date={value?.from} />
			<DatePickerHiddenInput name={`${name}-to`} date={value?.to} />
		</>
	);
}

function DateRangePicker({
	value: controlledValue,
	defaultValue,
	onValueChange,
	placeholder = "Pick a date range",
	formatOptions = DEFAULT_DATE_FORMAT,
	locale,
	disabled = false,
	name,
	id,
	className,
	"aria-invalid": ariaInvalid,
	"aria-label": ariaLabel,
	variant,
	calendarProps,
	defaultOpen,
	open: controlledOpen,
	onOpenChange,
}: DatePickerBaseProps & {
	/** Controlled value; pass `null` for a controlled empty selection. */
	value?: DateRange | null;
	defaultValue?: DateRange;
	onValueChange?: (range: DateRange | null) => void;
}) {
	const { isControlled, value, setUncontrolledValue, open, setOpen } =
		usePickerState<DateRange>({
			value: controlledValue,
			defaultValue,
			open: controlledOpen,
			defaultOpen,
			onOpenChange,
		});

	const handleSelect = (range: DateRange | undefined) => {
		if (!isControlled) setUncontrolledValue(range);
		onValueChange?.(range ?? null);
		if (isRangeSelectionComplete(range)) {
			setOpen(false);
		}
	};

	const selectedRange = value ?? undefined;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<DatePickerTrigger
				id={id}
				className={cn("min-w-64", className)}
				disabled={disabled}
				empty={!value?.from}
				aria-invalid={ariaInvalid}
				aria-label={ariaLabel}
				variant={variant}
			>
				{formatDateRangeLabel(value, locale, formatOptions, placeholder)}
			</DatePickerTrigger>
			<DateRangePickerHiddenInputs name={name} value={value} />
			<DatePickerContent>
				<Calendar
					mode="range"
					numberOfMonths={2}
					selected={selectedRange}
					onSelect={handleSelect}
					defaultMonth={selectedRange?.from}
					locale={locale}
					autoFocus
					{...calendarProps}
				/>
			</DatePickerContent>
		</Popover>
	);
}

export type { DateRange };
export { DatePicker, DatePickerTrigger, DateRangePicker };
