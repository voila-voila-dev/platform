import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	DateTimePicker,
	type DateTimeRange,
} from "@voila.dev/ui/date-time-picker";
import { useState } from "react";

const meta = {
	title: "UI/DateTimePicker",
	component: DateTimePicker.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof DateTimePicker.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

function ControlledDateTimePicker() {
	const [value, setValue] = useState<Date | null>(null);

	return (
		<DateTimePicker.Root
			value={value}
			onValueChange={setValue}
			placeholder="Project start"
			calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
		/>
	);
}

export const Default: Story = {
	render: () => <ControlledDateTimePicker />,
};

function PreselectedDateTimePicker() {
	const [value, setValue] = useState<Date | null>(new Date(2026, 5, 20, 9, 30));

	return <DateTimePicker.Root value={value} onValueChange={setValue} />;
}

export const WithValue: Story = {
	render: () => <PreselectedDateTimePicker />,
};

function FrenchLocaleDateTimePicker() {
	const [value, setValue] = useState<Date | null>(
		new Date(2026, 5, 20, 14, 30),
	);

	return (
		<DateTimePicker.Root
			locale="fr-FR"
			value={value}
			onValueChange={setValue}
			placeholder="Project start"
		/>
	);
}

export const FrenchLocale: Story = {
	render: () => <FrenchLocaleDateTimePicker />,
};

function FineStepDateTimePicker() {
	const [value, setValue] = useState<Date | null>(null);

	// A 15-minute grid for finer scheduling than the default 30.
	return (
		<DateTimePicker.Root
			value={value}
			onValueChange={setValue}
			minuteStep={15}
			placeholder="Pick to the quarter hour"
			calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
		/>
	);
}

export const FineStep: Story = {
	render: () => <FineStepDateTimePicker />,
};

export const Disabled: Story = {
	render: () => <DateTimePicker.Root disabled placeholder="Project start" />,
};

export const Invalid: Story = {
	render: () => (
		<DateTimePicker.Root aria-invalid placeholder="Project start (required)" />
	),
};

function ControlledNativeDateTimeInput() {
	const [value, setValue] = useState<Date | null>(null);

	return (
		<DateTimePicker.Native
			value={value}
			onValueChange={setValue}
			className="w-72"
		/>
	);
}

/** The mobile surface — the OS-native datetime field, with a `Date | null` API. */
export const Native: Story = {
	render: () => <ControlledNativeDateTimeInput />,
};

function ControlledResponsiveDateTimeInput() {
	const [value, setValue] = useState<Date | null>(null);

	return (
		<div className="w-72">
			<DateTimePicker.Responsive
				value={value}
				onValueChange={setValue}
				placeholder="Project start"
				calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
			/>
		</div>
	);
}

/**
 * Base UI popover on desktop, native field under 768px — resize the viewport (or
 * use the toolbar) to swap surfaces. One `Date | null` value model either way.
 */
export const Responsive: Story = {
	render: () => <ControlledResponsiveDateTimeInput />,
};

function ControlledDateTimeRangeInput() {
	const [range, setRange] = useState<DateTimeRange>({ start: null, end: null });

	// Picking a start seeds the end an hour later and bounds it to never fall before
	// the start — the shape a project's "Start"/"End" shift needs.
	return (
		<div className="w-full max-w-xl">
			<DateTimePicker.Range
				startLabel="Start"
				endLabel="End"
				value={range}
				onValueChange={setRange}
			/>
		</div>
	);
}

/** A start/end pair bound into one `{ start, end }` range, with end-after-start guardrails. */
export const Range: Story = {
	render: () => <ControlledDateTimeRangeInput />,
};

function FrenchLocaleDateTimeRangeInput() {
	const [range, setRange] = useState<DateTimeRange>({
		start: new Date(2026, 5, 20, 9, 0),
		end: new Date(2026, 5, 20, 17, 0),
	});

	return (
		<div className="w-full max-w-xl">
			<DateTimePicker.Range
				locale="fr-FR"
				startLabel="Start"
				endLabel="End"
				value={range}
				onValueChange={setRange}
			/>
		</div>
	);
}

export const RangeFrenchLocale: Story = {
	render: () => <FrenchLocaleDateTimeRangeInput />,
};

function ControlledShiftTimeRangeInput() {
	const [range, setRange] = useState<DateTimeRange>({ start: null, end: null });

	// A single field: pick a day and a start/end time in one popover; an end at or
	// before the start rolls to the next day (overnight). The shape a project shift needs.
	return (
		<div className="w-full max-w-sm">
			<DateTimePicker.ShiftRange
				placeholder="Pick a day and a time slot"
				value={range}
				onValueChange={setRange}
			/>
		</div>
	);
}

/** The single-field shift picker: one trigger, one popover (day + start/end times). */
export const Shift: Story = {
	render: () => <ControlledShiftTimeRangeInput />,
};

function PreselectedShiftTimeRangeInput() {
	const [range, setRange] = useState<DateTimeRange>({
		start: new Date(2026, 5, 20, 9, 0),
		end: new Date(2026, 5, 20, 17, 0),
	});

	return (
		<div className="w-full max-w-sm">
			<DateTimePicker.ShiftRange value={range} onValueChange={setRange} />
		</div>
	);
}

export const ShiftWithValue: Story = {
	render: () => <PreselectedShiftTimeRangeInput />,
};
