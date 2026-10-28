import { CalendarDotsIcon } from "@phosphor-icons/react";
import * as React from "react";
import { Button } from "#/button/components/button.tsx";
import { DatePicker } from "#/date-picker/components/date-picker.tsx";
import {
	PICKER_FIELD_CLASSES,
	PickerFieldContent,
} from "#/date-picker/components/picker-field.tsx";
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
import { Drawer } from "#/drawer/components/drawer.tsx";
import { useIsMobile } from "#/hooks/use-mobile.ts";
import { cn } from "#/lib/utils.ts";
import { Popover } from "#/popover/components/popover.tsx";

interface Props {
	/** Controlled range; both sides may be `null` independently. */
	value?: DateTimeRange;
	/** Initial range when uncontrolled. */
	defaultValue?: DateTimeRange;
	/** Called with the whole `{ start, end }` after either side changes. */
	onValueChange?: (range: DateTimeRange) => void;
	/** Shown on the single trigger while the shift is empty. */
	placeholder?: string;
	/** Ties the trigger to a `<label>`. */
	id?: string;
	/** BCP-47 locale (e.g. "fr-FR") for the trigger label, calendar, and time lists. */
	locale?: string;
	/** Blocks the trigger, so the popover cannot be opened. */
	disabled?: boolean;
	/** Minutes between two options in each time list. Defaults to 30. */
	minuteStep?: number;
	/** Duration (minutes) seeding the end when only a start exists. Defaults to 60. */
	defaultDurationMinutes?: number;
	/** Classes for the trigger. */
	className?: string;
	/** Marks the trigger invalid. Pair it with your own message. */
	"aria-invalid"?: React.AriaAttributes["aria-invalid"];
	/** Accessible name, for when there is no visible label. */
	"aria-label"?: string;
	/**
	 * Heading for the mobile drawer. Defaults to `placeholder`, which already
	 * names the field; pass it when that placeholder is not a title.
	 */
	drawerTitle?: string;
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
	drawerTitle,
}: Props) {
	const isMobile = useIsMobile();
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

	const label = shiftRangeLabel({ range, locale, placeholder });
	const icon = (
		<CalendarDotsIcon className="size-4 shrink-0 text-muted-foreground" />
	);
	const empty = !(range.start && range.end);
	const body = (
		<>
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
		</>
	);

	const handleOpenChange = (next: boolean) => {
		setOpen(next);
		if (next) setStep("start");
	};

	// A phone fits neither the anchored popover nor its two-column body, so the
	// same tabs and grids come up as a sheet instead. The value model does not
	// change with the surface: a shift still carries a date on each end.
	if (isMobile) {
		return (
			<Drawer.Root open={open} onOpenChange={handleOpenChange}>
				<Drawer.Trigger asChild>
					<Button
						id={id}
						variant="outline"
						data-slot="shift-time-range-trigger"
						data-empty={empty || undefined}
						className={cn(PICKER_FIELD_CLASSES, "w-full", className)}
						disabled={disabled}
						aria-invalid={ariaInvalid}
						aria-label={ariaLabel}
					>
						<PickerFieldContent icon={icon}>{label}</PickerFieldContent>
					</Button>
				</Drawer.Trigger>
				<Drawer.Content
					data-slot="shift-time-range-content"
					className="px-0 pb-2"
				>
					<Drawer.Header className="sr-only">
						<Drawer.Title>{drawerTitle ?? placeholder}</Drawer.Title>
					</Drawer.Header>
					{body}
				</Drawer.Content>
			</Drawer.Root>
		);
	}

	return (
		<Popover.Root open={open} onOpenChange={handleOpenChange}>
			<DatePicker.Trigger
				slotName="shift-time-range-trigger"
				icon={icon}
				id={id}
				className={cn("w-full", className)}
				disabled={disabled}
				empty={empty}
				aria-invalid={ariaInvalid}
				aria-label={ariaLabel}
			>
				{label}
			</DatePicker.Trigger>
			<Popover.Content
				data-slot="shift-time-range-content"
				className="w-[calc(100vw-2rem)] p-0 sm:w-auto"
				align="start"
			>
				{body}
			</Popover.Content>
		</Popover.Root>
	);
}
