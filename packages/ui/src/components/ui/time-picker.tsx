import { ClockIcon } from "@phosphor-icons/react";
import * as React from "react";
import { Button, type ButtonProps } from "#/components/ui/button.tsx";
import { DatePickerTrigger } from "#/components/ui/date-picker.tsx";
import { Popover, PopoverContent } from "#/components/ui/popover.tsx";
import { usePickerState } from "#/hooks/use-picker-state.ts";
import {
	formatMinutesLabel,
	minutesToTimeValue,
	parseTimeToMinutes,
} from "#/lib/time-math.ts";
import { cn } from "#/lib/utils.ts";

function formatTimeLabel(
	time: string,
	locale: string | undefined,
	options: Intl.DateTimeFormatOptions | undefined,
): string {
	const totalMinutes = parseTimeToMinutes(time);
	// An unparseable value is the caller's literal string; show it as-is.
	if (totalMinutes === null) return time;
	return formatMinutesLabel(totalMinutes, locale, options);
}

function timeRangeBoundsInMinutes(
	min: string,
	max: string,
): { first: number; last: number } {
	return {
		first: parseTimeToMinutes(min) ?? 0,
		last: parseTimeToMinutes(max) ?? 23 * 60 + 59,
	};
}

function timeOptionValues(min: string, max: string, step: number): string[] {
	const stepMinutes = step > 0 ? step : 30;
	const { first, last } = timeRangeBoundsInMinutes(min, max);
	const times: string[] = [];
	for (let minutes = first; minutes <= last; minutes += stepMinutes) {
		times.push(minutesToTimeValue(minutes));
	}
	return times;
}

/** The hidden form input serializing the selection as HH:mm (none without a name). */
function HiddenTimeInput({
	name,
	value,
}: {
	name: string | undefined;
	value: string | null | undefined;
}) {
	if (!name) return null;
	return <input type="hidden" name={name} value={value ?? ""} />;
}

function TimePickerOption({
	time,
	label,
	selected,
	selectedOptionRef,
	onSelect,
}: {
	time: string;
	label: string;
	selected: boolean;
	selectedOptionRef: React.Ref<HTMLButtonElement>;
	onSelect: (time: string) => void;
}) {
	return (
		<Button
			role="option"
			aria-selected={selected}
			data-selected={selected || undefined}
			variant="ghost"
			size="sm"
			className="shrink-0 justify-center font-normal data-selected:bg-primary data-selected:text-primary-foreground data-selected:hover:bg-primary data-selected:hover:text-primary-foreground"
			ref={selected ? selectedOptionRef : undefined}
			onClick={() => onSelect(time)}
		>
			{label}
		</Button>
	);
}

function TimePicker(props: {
	/** Controlled "HH:mm" value; pass `null` for a controlled empty selection. */
	value?: string | null;
	defaultValue?: string;
	onValueChange?: (time: string | null) => void;
	placeholder?: string;
	/**
	 * `Intl.DateTimeFormat` options for the labels. Defaults to a short localized
	 * time (`{ hour: "numeric", minute: "2-digit" }`, e.g. "2:30 PM" / "14:30").
	 */
	formatOptions?: Intl.DateTimeFormatOptions;
	/** BCP-47 locale (e.g. "fr-FR"), applied to the trigger and option labels. */
	locale?: string;
	disabled?: boolean;
	/** Minutes between two options. Defaults to 30. */
	step?: number;
	/** First selectable time, "HH:mm" inclusive. */
	min?: string;
	/** Last selectable time, "HH:mm" inclusive. */
	max?: string;
	/** Name for the hidden form input; the value is serialized as HH:mm. */
	name?: string;
	id?: string;
	className?: string;
	"aria-invalid"?: React.AriaAttributes["aria-invalid"];
	"aria-label"?: string;
	variant?: ButtonProps["variant"];
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const {
		value: controlledValue,
		defaultValue,
		onValueChange,
		placeholder = "Pick a time",
		formatOptions,
		locale,
		disabled = false,
		step = 30,
		min = "00:00",
		max = "23:59",
		name,
		id,
		className,
		"aria-invalid": ariaInvalid,
		"aria-label": ariaLabel,
		variant,
		defaultOpen,
		open: controlledOpen,
		onOpenChange,
	} = props;

	const { isControlled, value, setUncontrolledValue, open, setOpen } =
		usePickerState<string>({
			value: controlledValue,
			defaultValue,
			open: controlledOpen,
			defaultOpen,
			onOpenChange,
		});

	const options = React.useMemo(
		() => timeOptionValues(min, max, step),
		[step, min, max],
	);

	const selectedMinutes = parseTimeToMinutes(value);

	const handleSelect = (time: string) => {
		if (!isControlled) setUncontrolledValue(time);
		onValueChange?.(time);
		setOpen(false);
	};

	// The selected option receives the popup's initial focus (otherwise Base UI
	// focuses the first option, scrolling the list back to the top) and is then
	// centered once the popup has been positioned — the ref fires too early, so
	// defer by a frame. (Optional call: jsdom has no scrollIntoView.)
	const selectedOptionRef = React.useRef<HTMLButtonElement | null>(null);
	const setSelectedOption = React.useCallback(
		(node: HTMLButtonElement | null) => {
			selectedOptionRef.current = node;
			if (!node) return;
			requestAnimationFrame(() => node.scrollIntoView?.({ block: "center" }));
		},
		[],
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<DatePickerTrigger
				slot="time-picker-trigger"
				icon={<ClockIcon className="size-4 shrink-0 text-muted-foreground" />}
				id={id}
				className={cn("min-w-32", className)}
				disabled={disabled}
				empty={!value}
				aria-invalid={ariaInvalid}
				aria-label={ariaLabel}
				variant={variant}
			>
				{value ? formatTimeLabel(value, locale, formatOptions) : placeholder}
			</DatePickerTrigger>
			<HiddenTimeInput name={name} value={value} />
			<PopoverContent
				data-slot="time-picker-content"
				className="w-auto min-w-(--anchor-width) p-1"
				align="start"
				initialFocus={selectedMinutes !== null ? selectedOptionRef : undefined}
			>
				<div
					role="listbox"
					aria-label={ariaLabel ?? placeholder}
					className="flex max-h-64 flex-col gap-0.5 overflow-y-auto overscroll-contain"
				>
					{options.map((time) => (
						<TimePickerOption
							key={time}
							time={time}
							label={formatTimeLabel(time, locale, formatOptions)}
							selected={
								selectedMinutes !== null &&
								parseTimeToMinutes(time) === selectedMinutes
							}
							selectedOptionRef={setSelectedOption}
							onSelect={handleSelect}
						/>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}

export { TimePicker };
