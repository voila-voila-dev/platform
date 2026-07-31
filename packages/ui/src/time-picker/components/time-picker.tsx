import { ClockIcon } from "@phosphor-icons/react";
import * as React from "react";
import type { Button } from "#/button/components/button.tsx";
import { DatePicker } from "#/date-picker/components/date-picker.tsx";
import { usePickerState } from "#/hooks/use-picker-state.ts";
import { parseTimeToMinutes } from "#/lib/time-math.ts";
import { cn } from "#/lib/utils.ts";
import { Popover } from "#/popover/components/popover.tsx";
import { TimePickerHiddenInput } from "#/time-picker/components/time-picker-hidden-input.tsx";
import { TimePickerOption } from "#/time-picker/components/time-picker-option.tsx";
import {
	formatTimeLabel,
	timeOptionValues,
} from "#/time-picker/lib/time-picker-options.ts";

// Extends the trigger `Button`: `Popover.Root` is headless, so the trigger is
// the element a consumer styles and labels.
interface Props
	extends Omit<
		React.ComponentProps<typeof Button>,
		"value" | "defaultValue" | "onChange" | "children"
	> {
	/** Controlled "HH:mm" value; pass `null` for a controlled empty selection. */
	value?: string | null;
	/** Initial `"HH:mm"` value when uncontrolled. */
	defaultValue?: string;
	/** Called with the picked `"HH:mm"`, or `null` when cleared. Never a `Date`. */
	onValueChange?: (time: string | null) => void;
	/** Shown on the trigger while nothing is selected. */
	placeholder?: string;
	/**
	 * `Intl.DateTimeFormat` options for the labels. Defaults to a short localized
	 * time (`{ hour: "numeric", minute: "2-digit" }`, e.g. "2:30 PM" / "14:30").
	 */
	formatOptions?: Intl.DateTimeFormatOptions;
	/** BCP-47 locale (e.g. "fr-FR"), applied to the trigger and option labels. */
	locale?: string;
	/** Minutes between two options. Defaults to 30. */
	step?: number;
	/** First selectable time, "HH:mm" inclusive. */
	min?: string;
	/** Last selectable time, "HH:mm" inclusive. */
	max?: string;
	/** Name for the hidden form input; the value is serialized as HH:mm. */
	name?: string;
	/** Whether the list starts open. Uncontrolled — for the controlled form use `open`. */
	defaultOpen?: boolean;
	/** Controlled open state. Pair it with `onOpenChange`. */
	open?: boolean;
	/** Called when the list opens or closes. */
	onOpenChange?: (open: boolean) => void;
}

export function TimePicker({
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
	className,
	"aria-label": ariaLabel,
	defaultOpen,
	open: controlledOpen,
	onOpenChange,
	...props
}: Props) {
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
		<Popover.Root open={open} onOpenChange={setOpen}>
			<DatePicker.Trigger
				slotName="time-picker-trigger"
				icon={<ClockIcon className="size-4 shrink-0 text-muted-foreground" />}
				className={cn("min-w-32", className)}
				disabled={disabled}
				empty={!value}
				aria-label={ariaLabel}
				{...props}
			>
				{value ? formatTimeLabel(value, locale, formatOptions) : placeholder}
			</DatePicker.Trigger>
			<TimePickerHiddenInput name={name} value={value} />
			<Popover.Content
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
							ref={setSelectedOption}
							onSelect={handleSelect}
						/>
					))}
				</div>
			</Popover.Content>
		</Popover.Root>
	);
}
