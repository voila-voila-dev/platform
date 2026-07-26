import { CalendarDotsIcon } from "@phosphor-icons/react";
import * as React from "react";
import { DatePicker } from "#/date-picker/components/date-picker.tsx";
import { ShiftPickerBody } from "#/date-time-picker/components/shift-picker-body.tsx";
import { ShiftStepTabs } from "#/date-time-picker/components/shift-step-tabs.tsx";
import {
	type DateTimeRange,
	useDateTimeRangeState,
} from "#/date-time-picker/lib/date-time-range.ts";
import {
	rangeWithDay,
	rangeWithTime,
	type ShiftStep,
	shiftRangeLabel,
} from "#/date-time-picker/lib/shift-time-range.ts";
import { cn } from "#/lib/utils.ts";
import { Popover } from "#/popover/components/popover.tsx";

interface Props {
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
}

/**
 * A single trigger for a shift's start and end. One field, but you pick a full
 * start datetime then a full end datetime: the popover shows one calendar and one
 * time grid at a time, switched by a Start/End tab. Because each end owns its own
 * date, cross-day shifts (e.g. 20:00 → 02:00 the next day) are picked directly,
 * with no wrap trick. Speaks the same `{ start, end }` model as {@link DateTimeRangeInput}.
 */
export function ShiftTimeRangeInput({
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
}: Props) {
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
		<Popover.Root
			open={open}
			onOpenChange={(next) => {
				setOpen(next);
				if (next) setStep("start");
			}}
		>
			<DatePicker.Trigger
				slotName="shift-time-range-trigger"
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
			</DatePicker.Trigger>
			<Popover.Content
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
			</Popover.Content>
		</Popover.Root>
	);
}
