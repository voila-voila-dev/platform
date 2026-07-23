import { CalendarDotsIcon } from "@phosphor-icons/react";
import * as React from "react";
import { Button, type ButtonProps } from "#/components/ui/button.tsx";
import { Calendar } from "#/components/ui/calendar.tsx";
import { DatePickerTrigger } from "#/components/ui/date-picker.tsx";
import { Label } from "#/components/ui/label.tsx";
import { NativeDateTimePicker } from "#/components/ui/native-date-picker.tsx";
import { Popover, PopoverContent } from "#/components/ui/popover.tsx";
import { useIsMobile } from "#/hooks/use-mobile.ts";
import { usePickerState } from "#/hooks/use-picker-state.ts";
import {
	formatMinutesLabel,
	minutesOfDay,
	withMinutes,
} from "#/lib/time-math.ts";
import { cn } from "#/lib/utils.ts";

// One datetime field, two surfaces — mirroring `ResponsiveSelect`/`ResponsiveDialog`:
// the Base UI popover `DateTimePicker` (calendar + time list) on desktop and the
// OS-native `<input type="datetime-local">` under the `useIsMobile` breakpoint
// (768px), where the native picker is the better touch experience. All three speak
// a single `Date | null` value model so callers never juggle datetime strings.

/** Default time (09:00) applied when a day is picked before any time exists. */
const DEFAULT_MINUTES = 9 * 60;

const pad = (input: number): string => String(input).padStart(2, "0");

/** Local `yyyy-MM-ddTHH:mm` — the shape an `<input type="datetime-local">` wants. */
function toLocalInputValue(date: Date): string {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
		date.getDate(),
	)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Parse the native input's local datetime string back to a `Date` (null when empty). */
function parseLocalInputValue(value: string): Date | null {
	if (!value) return null;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

/** Long localized date + time for the trigger label (e.g. "Jun 20, 2026, 2:30 PM"). */
const DEFAULT_DATE_TIME_FORMAT: Intl.DateTimeFormatOptions = {
	dateStyle: "medium",
	timeStyle: "short",
};

/** Localized time label for a minute-of-day, matching `TimePicker`. */
function timeLabel(totalMinutes: number, locale: string | undefined): string {
	return formatMinutesLabel(totalMinutes, locale);
}

/** Every minute-of-day option a time list offers, `minuteStep` apart. */
function useTimeOptions(minuteStep: number): number[] {
	return React.useMemo(() => {
		const stepMinutes = minuteStep > 0 ? minuteStep : 30;
		const times: number[] = [];
		for (let minutes = 0; minutes <= 23 * 60 + 59; minutes += stepMinutes) {
			times.push(minutes);
		}
		return times;
	}, [minuteStep]);
}

type DateTimeSharedProps = {
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

type DateTimePickerProps = DateTimeSharedProps & {
	/**
	 * `Intl.DateTimeFormat` options for the trigger label. Defaults to
	 * `{ dateStyle: "medium", timeStyle: "short" }` (e.g. "Jun 20, 2026, 2:30 PM").
	 */
	formatOptions?: Intl.DateTimeFormatOptions;
	variant?: ButtonProps["variant"];
	/** Escape hatch for the underlying Calendar (disabled days, week numbers…). */
	calendarProps?: Omit<
		React.ComponentProps<typeof Calendar>,
		"mode" | "selected" | "onSelect" | "locale"
	>;
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
};

/**
 * {@link DateTimePicker}'s selection handlers around the shared picker state.
 * Picking a day keeps the existing time-of-day (or 09:00 the first time), and
 * leaves the popover open so the time can still be chosen; picking a time
 * completes the selection (against today when no day is set yet) and closes
 * the popover, mirroring `TimePicker`.
 */
function createDateTimeSelectionHandlers(state: {
	isControlled: boolean;
	value: Date | null | undefined;
	setUncontrolledValue: (value: Date | undefined) => void;
	setOpen: (open: boolean) => void;
	onValueChange: ((date: Date | null) => void) | undefined;
}): {
	handleDaySelect: (day: Date | undefined) => void;
	handleTimeSelect: (totalMinutes: number) => void;
} {
	const commit = (next: Date | null) => {
		if (!state.isControlled) state.setUncontrolledValue(next ?? undefined);
		state.onValueChange?.(next);
	};

	const handleDaySelect = (day: Date | undefined) => {
		if (!day) {
			commit(null);
			return;
		}
		commit(
			withMinutes(
				day,
				state.value ? minutesOfDay(state.value) : DEFAULT_MINUTES,
			),
		);
	};

	const handleTimeSelect = (totalMinutes: number) => {
		commit(withMinutes(state.value ?? new Date(), totalMinutes));
		state.setOpen(false);
	};

	return { handleDaySelect, handleTimeSelect };
}

function dateTimeTriggerLabel(
	value: Date | null | undefined,
	locale: string | undefined,
	formatOptions: Intl.DateTimeFormatOptions,
	placeholder: string,
): string {
	return value
		? new Intl.DateTimeFormat(locale, formatOptions).format(value)
		: placeholder;
}

/** Serialized `yyyy-MM-ddTHH:mm` form value, rendered only when named. */
function DateTimeHiddenInput({
	name,
	value,
}: {
	name: string | undefined;
	value: Date | null | undefined;
}) {
	if (!name) {
		return null;
	}
	return (
		<input
			type="hidden"
			name={name}
			value={value ? toLocalInputValue(value) : ""}
		/>
	);
}

/** The scrollable time-of-day column beside {@link DateTimePicker}'s calendar. */
function DateTimeOptionList({
	options,
	selectedMinutes,
	locale,
	ariaLabel,
	onSelect,
}: {
	options: ReadonlyArray<number>;
	selectedMinutes: number | null;
	locale: string | undefined;
	ariaLabel: string;
	onSelect: (totalMinutes: number) => void;
}) {
	// Center the selected time option once the popup is positioned (the ref fires
	// too early, so defer by a frame). Optional call: jsdom has no scrollIntoView.
	const setSelectedOption = React.useCallback(
		(node: HTMLButtonElement | null) => {
			if (!node) return;
			requestAnimationFrame(() => node.scrollIntoView?.({ block: "center" }));
		},
		[],
	);

	return (
		<div
			role="listbox"
			aria-label={ariaLabel}
			className="flex max-h-72 w-28 flex-col gap-0.5 overflow-y-auto overscroll-contain border-l p-1.5"
		>
			{options.map((minutes) => {
				const selected = selectedMinutes === minutes;
				return (
					<Button
						key={minutes}
						type="button"
						role="option"
						aria-selected={selected}
						data-selected={selected || undefined}
						variant="ghost"
						size="sm"
						className="shrink-0 justify-center font-normal data-selected:bg-primary data-selected:text-primary-foreground data-selected:hover:bg-primary data-selected:hover:text-primary-foreground"
						ref={selected ? setSelectedOption : undefined}
						onClick={() => onSelect(minutes)}
					>
						{timeLabel(minutes, locale)}
					</Button>
				);
			})}
		</div>
	);
}

/**
 * Composed date + time picker built on the kit's Base UI `Popover` and `Calendar`:
 * the calendar sets the day, a scrollable list sets the time, and the trigger shows
 * the combined, localized datetime. Controlled or uncontrolled, like `DatePicker`.
 */
function DateTimePicker({
	value: controlledValue,
	defaultValue,
	onValueChange,
	placeholder = "Pick a date and time",
	formatOptions = DEFAULT_DATE_TIME_FORMAT,
	locale,
	name,
	"aria-label": ariaLabel,
	minuteStep = 30,
	calendarProps,
	defaultOpen,
	open: controlledOpen,
	onOpenChange,
	...triggerProps
}: DateTimePickerProps) {
	const { isControlled, value, setUncontrolledValue, open, setOpen } =
		usePickerState<Date>({
			value: controlledValue,
			defaultValue,
			open: controlledOpen,
			defaultOpen,
			onOpenChange,
		});

	const { handleDaySelect, handleTimeSelect } = createDateTimeSelectionHandlers(
		{ isControlled, value, setUncontrolledValue, setOpen, onValueChange },
	);

	const options = useTimeOptions(minuteStep);

	const selectedMinutes = value ? minutesOfDay(value) : null;
	const selectedDay = value ?? undefined;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<DatePickerTrigger
				slot="date-time-picker-trigger"
				icon={
					<CalendarDotsIcon className="size-4 shrink-0 text-muted-foreground" />
				}
				empty={!value}
				aria-label={ariaLabel}
				{...triggerProps}
			>
				{dateTimeTriggerLabel(value, locale, formatOptions, placeholder)}
			</DatePickerTrigger>
			<DateTimeHiddenInput name={name} value={value} />
			<PopoverContent
				data-slot="date-time-picker-content"
				className="w-auto p-0"
				align="start"
			>
				<div className="flex">
					<Calendar
						mode="single"
						selected={selectedDay}
						onSelect={handleDaySelect}
						defaultMonth={selectedDay}
						locale={locale}
						autoFocus
						{...calendarProps}
					/>
					<DateTimeOptionList
						options={options}
						selectedMinutes={selectedMinutes}
						locale={locale}
						ariaLabel={ariaLabel ?? placeholder}
						onSelect={handleTimeSelect}
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
}

type NativeDateTimePickerProps = React.ComponentProps<
	typeof NativeDateTimePicker
>;

type NativeDateTimeInputProps = Omit<
	NativeDateTimePickerProps,
	"value" | "defaultValue" | "onChange"
> & {
	value?: Date | null;
	onValueChange?: (date: Date | null) => void;
};

/**
 * `Date`-valued adapter over the native `<input type="datetime-local">`, so the
 * mobile surface shares the picker family's value model. The native field uses the
 * viewer's local clock, matching {@link DateTimePicker}.
 */
function NativeDateTimeInput({
	value,
	onValueChange,
	...props
}: NativeDateTimeInputProps) {
	return (
		<NativeDateTimePicker
			value={value ? toLocalInputValue(value) : ""}
			onChange={(event) =>
				onValueChange?.(parseLocalInputValue(event.target.value))
			}
			{...props}
		/>
	);
}

type ResponsiveDateTimeInputProps = DateTimeSharedProps & {
	/** `Intl.DateTimeFormat` options for the desktop trigger label. */
	formatOptions?: Intl.DateTimeFormatOptions;
	calendarProps?: DateTimePickerProps["calendarProps"];
	/** Min selectable time on the native input, `HH:mm`. */
	min?: string;
	/** Max selectable time on the native input, `HH:mm`. */
	max?: string;
};

/**
 * The datetime equivalent of `ResponsiveSelect`: the Base UI {@link DateTimePicker}
 * on desktop and the native {@link NativeDateTimeInput} under the `useIsMobile`
 * breakpoint, behind one `Date | null` value API. Both surfaces fill their
 * container width by default (override via `className`).
 */
function ResponsiveDateTimeInput({
	value,
	defaultValue,
	onValueChange,
	placeholder,
	formatOptions,
	locale,
	disabled,
	name,
	id,
	className,
	"aria-invalid": ariaInvalid,
	"aria-label": ariaLabel,
	minuteStep,
	calendarProps,
	min,
	max,
}: ResponsiveDateTimeInputProps) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<NativeDateTimeInput
				id={id}
				name={name}
				value={value ?? null}
				onValueChange={onValueChange}
				disabled={disabled}
				required={false}
				min={min}
				max={max}
				aria-invalid={ariaInvalid}
				aria-label={ariaLabel}
				className={className}
				wrapperClassName="w-full"
			/>
		);
	}

	return (
		<DateTimePicker
			id={id}
			name={name}
			value={value}
			defaultValue={defaultValue}
			onValueChange={onValueChange}
			placeholder={placeholder}
			formatOptions={formatOptions}
			locale={locale}
			disabled={disabled}
			minuteStep={minuteStep}
			calendarProps={calendarProps}
			aria-invalid={ariaInvalid}
			aria-label={ariaLabel}
			className={cn("w-full", className)}
		/>
	);
}

/** A start/end pair, each `null` until picked, as {@link DateTimeRangeInput} holds it. */
type DateTimeRange = {
	start: Date | null;
	end: Date | null;
};

type DateTimeRangeInputProps = {
	/** Controlled range; both sides may be `null` independently. */
	value?: DateTimeRange;
	defaultValue?: DateTimeRange;
	onValueChange?: (range: DateTimeRange) => void;
	/** Label above the start field. Defaults to "Start". */
	startLabel?: React.ReactNode;
	/** Label above the end field. Defaults to "End". */
	endLabel?: React.ReactNode;
	startPlaceholder?: string;
	endPlaceholder?: string;
	/** id for the start field; the end field derives `${startId}-end` when `endId` is omitted. */
	startId?: string;
	endId?: string;
	/** BCP-47 locale (e.g. "fr-FR"), applied to both fields' labels, calendars, and time lists. */
	locale?: string;
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
	"aria-invalid"?: React.AriaAttributes["aria-invalid"];
};

/** Local `yyyy-MM-ddTHH:mm` at midnight of the given day. */
function startOfDay(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Controlled-or-uncontrolled `{ start, end }` state, shared by the two range
 * inputs: `range` is the current value and `commit` writes it (updating the
 * internal state only while uncontrolled) before notifying the caller.
 */
function useDateTimeRangeState({
	value,
	defaultValue,
	onValueChange,
}: {
	value?: DateTimeRange;
	defaultValue?: DateTimeRange;
	onValueChange?: (range: DateTimeRange) => void;
}): { range: DateTimeRange; commit: (next: DateTimeRange) => void } {
	const isControlled = value !== undefined;
	const [uncontrolled, setUncontrolled] = React.useState<DateTimeRange>(
		defaultValue ?? { start: null, end: null },
	);

	return {
		range: isControlled ? value : uncontrolled,
		commit: (next: DateTimeRange) => {
			if (!isControlled) setUncontrolled(next);
			onValueChange?.(next);
		},
	};
}

function resolveEndFieldId(
	startId: string | undefined,
	endId: string | undefined,
): string | undefined {
	if (endId !== undefined) {
		return endId;
	}
	return startId ? `${startId}-end` : undefined;
}

/**
 * Keep the end from landing before the start: bound the native input and disable
 * earlier days in the desktop calendar (the start-change seeding handles same-day
 * times).
 */
function endFieldBounds(start: Date | null): {
	min: string | undefined;
	calendarProps: { disabled: { before: Date } } | undefined;
} {
	if (start === null) {
		return { min: undefined, calendarProps: undefined };
	}
	return {
		min: toLocalInputValue(start),
		calendarProps: { disabled: { before: startOfDay(start) } },
	};
}

/**
 * Two labeled {@link ResponsiveDateTimeInput}s bound into a single start/end range.
 * Picking a start seeds (or nudges) the end so the span stays valid, and the end
 * field is bounded to never fall before the start (its calendar disables earlier
 * days and the native input carries a `min`). Both surfaces speak one
 * `{ start, end }` value model, so callers never juggle datetime strings.
 */
function DateTimeRangeInput({
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
}: DateTimeRangeInputProps) {
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
		<div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2", className)}>
			<div className="flex flex-col gap-1.5">
				<Label htmlFor={startId}>{startLabel}</Label>
				<ResponsiveDateTimeInput
					id={startId}
					value={range.start}
					onValueChange={handleStartChange}
					placeholder={startPlaceholder}
					locale={locale}
					disabled={disabled}
					minuteStep={minuteStep}
					formatOptions={formatOptions}
					aria-invalid={ariaInvalid}
				/>
			</div>
			<div className="flex flex-col gap-1.5">
				<Label htmlFor={resolvedEndId}>{endLabel}</Label>
				<ResponsiveDateTimeInput
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

type ShiftTimeRangeInputProps = {
	/** Controlled range; both sides may be `null` independently. */
	value?: DateTimeRange;
	defaultValue?: DateTimeRange;
	onValueChange?: (range: DateTimeRange) => void;
	placeholder?: string;
	id?: string;
	/** BCP-47 locale (e.g. "fr-FR") for the trigger label, calendar, and time lists. */
	locale?: string;
	disabled?: boolean;
	/** Minutes between two options in each time list. Defaults to 30. */
	minuteStep?: number;
	/** Duration (minutes) seeding the end when only a start exists. Defaults to 60. */
	defaultDurationMinutes?: number;
	className?: string;
	"aria-invalid"?: React.AriaAttributes["aria-invalid"];
	"aria-label"?: string;
};

/** Which end of the range the popover is currently editing. */
type ShiftStep = "start" | "end";

/**
 * Keep the end strictly after the start: preserve the user's end when it still
 * holds, otherwise reseed it one duration later, rolling across midnight when
 * needed.
 */
function endAfter(
	start: Date,
	end: Date | null,
	defaultDurationMinutes: number,
): Date {
	return end !== null && end.getTime() > start.getTime()
		? end
		: new Date(start.getTime() + defaultDurationMinutes * 60_000);
}

/** The range after picking `day` on the active step, keeping the time-of-day. */
function rangeWithDay({
	range,
	day,
	step,
	defaultDurationMinutes,
}: {
	range: DateTimeRange;
	day: Date;
	step: ShiftStep;
	defaultDurationMinutes: number;
}): DateTimeRange {
	const base = startOfDay(day);
	if (step === "start") {
		const start = withMinutes(
			base,
			range.start ? minutesOfDay(range.start) : DEFAULT_MINUTES,
		);
		return { start, end: endAfter(start, range.end, defaultDurationMinutes) };
	}
	const minutes = range.end
		? minutesOfDay(range.end)
		: range.start
			? minutesOfDay(range.start)
			: DEFAULT_MINUTES;
	return { start: range.start, end: withMinutes(base, minutes) };
}

/** The range after picking `minutes` on the active step, keeping the day. */
function rangeWithTime({
	range,
	minutes,
	step,
	defaultDurationMinutes,
}: {
	range: DateTimeRange;
	minutes: number;
	step: ShiftStep;
	defaultDurationMinutes: number;
}): DateTimeRange {
	if (step === "start") {
		const base = range.start ? startOfDay(range.start) : startOfDay(new Date());
		const start = withMinutes(base, minutes);
		return { start, end: endAfter(start, range.end, defaultDurationMinutes) };
	}
	const base = range.end
		? startOfDay(range.end)
		: range.start
			? startOfDay(range.start)
			: startOfDay(new Date());
	return { start: range.start, end: withMinutes(base, minutes) };
}

/** Short localized day for the trigger and the step tabs, e.g. "20 juin". */
function shiftDateLabel(date: Date, locale: string | undefined): string {
	return new Intl.DateTimeFormat(locale, {
		day: "numeric",
		month: "short",
	}).format(date);
}

/** One side of the range as a day + time summary, or a dash when unpicked. */
function shiftStepLabel(date: Date | null, locale: string | undefined): string {
	return date === null
		? "—"
		: `${shiftDateLabel(date, locale)} · ${timeLabel(minutesOfDay(date), locale)}`;
}

/**
 * The trigger label: a single day with a time span when the shift stays within
 * one day, otherwise both sides spelled out; the placeholder until both are set.
 */
function shiftRangeLabel({
	range,
	locale,
	placeholder,
}: {
	range: DateTimeRange;
	locale: string | undefined;
	placeholder: string;
}): string {
	const { start, end } = range;
	if (start === null || end === null) {
		return placeholder;
	}
	if (startOfDay(start).getTime() === startOfDay(end).getTime()) {
		return `${shiftDateLabel(start, locale)} · ${timeLabel(
			minutesOfDay(start),
			locale,
		)} – ${timeLabel(minutesOfDay(end), locale)}`;
	}
	return `${shiftStepLabel(start, locale)} → ${shiftStepLabel(end, locale)}`;
}

/**
 * On the end step, never let the end land on or before the start: earlier times
 * on the start's own day are grayed out (earlier days are already off the
 * calendar).
 */
function isShiftTimeDisabled({
	minutes,
	step,
	range,
	activeDay,
}: {
	minutes: number;
	step: ShiftStep;
	range: DateTimeRange;
	activeDay: Date | null;
}): boolean {
	if (step !== "end" || range.start === null || activeDay === null) {
		return false;
	}
	if (activeDay.getTime() !== startOfDay(range.start).getTime()) {
		return false;
	}
	return minutes <= minutesOfDay(range.start);
}

/**
 * A single trigger for a shift's start and end. One field, but you pick a full
 * start datetime then a full end datetime: the popover shows one calendar and one
 * time grid at a time, switched by a Start/End tab. Because each end owns its own
 * date, cross-day shifts (e.g. 20:00 → 02:00 the next day) are picked directly,
 * with no wrap trick. Speaks the same `{ start, end }` model as {@link DateTimeRangeInput}.
 */
function ShiftTimeRangeInput({
	value: controlledValue,
	defaultValue,
	onValueChange,
	placeholder = "Pick a shift",
	id,
	locale,
	disabled = false,
	minuteStep = 30,
	defaultDurationMinutes = 60,
	className,
	"aria-invalid": ariaInvalid,
	"aria-label": ariaLabel,
}: ShiftTimeRangeInputProps) {
	const { range, commit } = useDateTimeRangeState({
		value: controlledValue,
		defaultValue,
		onValueChange,
	});
	const [open, setOpen] = React.useState(false);
	const [step, setStep] = React.useState<ShiftStep>("start");

	const handleDaySelect = (picked: Date | undefined) => {
		if (!picked) return;
		commit(rangeWithDay({ range, day: picked, step, defaultDurationMinutes }));
	};

	const handleTimeSelect = (minutes: number) => {
		commit(rangeWithTime({ range, minutes, step, defaultDurationMinutes }));
		if (step === "start") {
			// Guide the user straight to picking the end.
			setStep("end");
		} else {
			setOpen(false);
		}
	};

	return (
		<Popover
			open={open}
			onOpenChange={(next) => {
				setOpen(next);
				if (next) setStep("start");
			}}
		>
			<DatePickerTrigger
				slot="shift-time-range-trigger"
				icon={
					<CalendarDotsIcon className="size-4 shrink-0 text-muted-foreground" />
				}
				id={id}
				className={cn("w-full", className)}
				disabled={disabled}
				empty={!(range.start && range.end)}
				aria-invalid={ariaInvalid}
				aria-label={ariaLabel}
			>
				{shiftRangeLabel({ range, locale, placeholder })}
			</DatePickerTrigger>
			<PopoverContent
				data-slot="shift-time-range-content"
				className="w-[calc(100vw-2rem)] p-0 sm:w-auto"
				align="start"
			>
				<ShiftStepTabs
					step={step}
					range={range}
					locale={locale}
					onStepChange={setStep}
				/>
				<ShiftPickerBody
					range={range}
					step={step}
					locale={locale}
					minuteStep={minuteStep}
					onDaySelect={handleDaySelect}
					onTimeSelect={handleTimeSelect}
				/>
			</PopoverContent>
		</Popover>
	);
}

/** The Start/End switch above the picker, each side showing its current summary. */
function ShiftStepTabs({
	step,
	range,
	locale,
	onStepChange,
}: {
	step: ShiftStep;
	range: DateTimeRange;
	locale: string | undefined;
	onStepChange: (step: ShiftStep) => void;
}) {
	return (
		<div className="grid grid-cols-2 gap-1.5 border-b p-1.5">
			<StepTab
				active={step === "start"}
				heading={startLabelText(locale)}
				value={shiftStepLabel(range.start, locale)}
				onClick={() => onStepChange("start")}
			/>
			<StepTab
				active={step === "end"}
				heading={endLabelText(locale)}
				value={shiftStepLabel(range.end, locale)}
				onClick={() => onStepChange("end")}
			/>
		</div>
	);
}

/** The active side's day and minutes-of-day, `null` until that side is picked. */
function shiftActiveSelection(
	range: DateTimeRange,
	step: ShiftStep,
): { activeDay: Date | null; activeMinutes: number | null } {
	const active = step === "start" ? range.start : range.end;
	return {
		activeDay: active ? startOfDay(active) : null,
		activeMinutes: active ? minutesOfDay(active) : null,
	};
}

/** Bound the end step's calendar to the start's day onward. */
function shiftCalendarDisabled(
	range: DateTimeRange,
	step: ShiftStep,
): { before: Date } | undefined {
	if (step !== "end") {
		return undefined;
	}
	if (range.start === null) {
		return undefined;
	}
	return { before: startOfDay(range.start) };
}

function shiftCalendarDefaultMonth(
	activeDay: Date | null,
	range: DateTimeRange,
): Date | undefined {
	return activeDay ?? range.start ?? undefined;
}

/** The active step's calendar beside its time column. */
function ShiftPickerBody({
	range,
	step,
	locale,
	minuteStep,
	onDaySelect,
	onTimeSelect,
}: {
	range: DateTimeRange;
	step: ShiftStep;
	locale: string | undefined;
	minuteStep: number;
	onDaySelect: (day: Date | undefined) => void;
	onTimeSelect: (minutes: number) => void;
}) {
	const timeOptions = useTimeOptions(minuteStep);
	const { activeDay, activeMinutes } = shiftActiveSelection(range, step);

	return (
		<div className="flex flex-col sm:flex-row">
			<Calendar
				mode="single"
				selected={activeDay ?? undefined}
				onSelect={onDaySelect}
				defaultMonth={shiftCalendarDefaultMonth(activeDay, range)}
				locale={locale}
				disabled={shiftCalendarDisabled(range, step)}
				autoFocus
			/>
			{/* The time column stretches to the calendar's exact height (its scroll
			    list is absolutely positioned on desktop so it never grows the row),
			    so the divider spans cleanly with no dangling border. */}
			<div className="relative w-full border-t sm:w-40 sm:border-t-0 sm:border-l">
				<TimeList
					options={timeOptions}
					selectedMinutes={activeMinutes}
					isDisabled={(minutes) =>
						isShiftTimeDisabled({ minutes, step, range, activeDay })
					}
					onSelect={onTimeSelect}
					locale={locale}
					ariaLabel={
						step === "start" ? startLabelText(locale) : endLabelText(locale)
					}
				/>
			</div>
		</div>
	);
}

/** Localized labels for the Start/End tabs. */
function startLabelText(locale: string | undefined): string {
	return locale?.startsWith("fr") ? "Début" : "Start";
}
function endLabelText(locale: string | undefined): string {
	return locale?.startsWith("fr") ? "Fin" : "End";
}

/** One of the two step tabs: a heading over the side's current datetime summary. */
function StepTab({
	active,
	heading,
	value,
	onClick,
}: {
	active: boolean;
	heading: string;
	value: string;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			data-active={active || undefined}
			onClick={onClick}
			className="flex flex-col items-start gap-0.5 rounded-md border border-transparent px-2.5 py-1.5 text-left transition-colors hover:bg-accent data-active:border-input data-active:bg-accent"
		>
			<span className="text-xs font-medium text-muted-foreground">
				{heading}
			</span>
			<span className="line-clamp-1 text-sm">{value}</span>
		</button>
	);
}

/** The active step's time options as a single scrollable column. */
function TimeList({
	options,
	selectedMinutes,
	isDisabled,
	onSelect,
	locale,
	ariaLabel,
}: {
	options: ReadonlyArray<number>;
	selectedMinutes: number | null;
	isDisabled: (minutes: number) => boolean;
	onSelect: (minutes: number) => void;
	locale: string | undefined;
	ariaLabel: string;
}) {
	const centerOption = React.useCallback((node: HTMLButtonElement | null) => {
		if (!node) return;
		requestAnimationFrame(() => node.scrollIntoView?.({ block: "center" }));
	}, []);
	// Open scrolled to the selected time, or centered on midday when none is picked
	// yet (so the list doesn't sit pinned at 00:00). Snap the target to the nearest
	// option in case the step doesn't divide noon.
	const focusMinutes = selectedMinutes ?? 12 * 60;
	const scrollTarget = options.reduce(
		(best, minutes) =>
			Math.abs(minutes - focusMinutes) < Math.abs(best - focusMinutes)
				? minutes
				: best,
		options[0] ?? focusMinutes,
	);
	return (
		<div
			role="listbox"
			aria-label={ariaLabel}
			// On desktop the list fills its stretched parent (which matches the
			// calendar height) and scrolls as a single narrow column. On mobile the
			// row stacks under the calendar, so a single column would waste the full
			// width and scroll forever; lay the times out as a compact grid instead.
			className="grid max-h-56 grid-cols-3 gap-1 overflow-y-auto overscroll-contain p-1.5 sm:absolute sm:inset-0 sm:flex sm:max-h-none sm:grid-cols-1 sm:flex-col sm:gap-0.5"
		>
			{options.map((minutes) => {
				const selected = selectedMinutes === minutes;
				return (
					<Button
						key={minutes}
						type="button"
						role="option"
						aria-selected={selected}
						data-selected={selected || undefined}
						disabled={isDisabled(minutes)}
						variant="ghost"
						size="sm"
						className="shrink-0 justify-center font-normal data-selected:bg-primary data-selected:text-primary-foreground data-selected:hover:bg-primary data-selected:hover:text-primary-foreground"
						ref={minutes === scrollTarget ? centerOption : undefined}
						onClick={() => onSelect(minutes)}
					>
						{timeLabel(minutes, locale)}
					</Button>
				);
			})}
		</div>
	);
}

export {
	DateTimePicker,
	type DateTimePickerProps,
	type DateTimeRange,
	DateTimeRangeInput,
	type DateTimeRangeInputProps,
	NativeDateTimeInput,
	type NativeDateTimeInputProps,
	ResponsiveDateTimeInput,
	type ResponsiveDateTimeInputProps,
	ShiftTimeRangeInput,
	type ShiftTimeRangeInputProps,
};
