import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { DatePicker, type DateRange } from "@voila.dev/ui/date-picker";
import { useState } from "react";

const meta = {
	title: "UI/DatePicker",
	component: DatePicker.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof DatePicker.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

function SingleDatePicker() {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	return (
		<DatePicker.Root
			value={selectedDate}
			onValueChange={setSelectedDate}
			placeholder="Project date"
			calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
		/>
	);
}

export const Default: Story = {
	render: () => <SingleDatePicker />,
};

function PreselectedDatePicker() {
	const [selectedDate, setSelectedDate] = useState<Date | null>(
		new Date(2026, 5, 20),
	);

	return (
		<DatePicker.Root value={selectedDate} onValueChange={setSelectedDate} />
	);
}

export const WithValue: Story = {
	render: () => <PreselectedDatePicker />,
};

function FrenchLocaleDatePicker() {
	const [selectedDate, setSelectedDate] = useState<Date | null>(
		new Date(2026, 5, 20),
	);

	return (
		<DatePicker.Root
			locale="fr-FR"
			value={selectedDate}
			onValueChange={setSelectedDate}
			placeholder="Project date"
		/>
	);
}

export const FrenchLocale: Story = {
	render: () => <FrenchLocaleDatePicker />,
};

function DisabledDaysDatePicker() {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	// Weekends are disabled — e.g. weekday-only project scheduling.
	return (
		<DatePicker.Root
			value={selectedDate}
			onValueChange={setSelectedDate}
			placeholder="Weekday project date"
			calendarProps={{
				defaultMonth: new Date(2026, 5, 1),
				disabled: { dayOfWeek: [0, 6] },
			}}
		/>
	);
}

export const DisabledDays: Story = {
	render: () => <DisabledDaysDatePicker />,
};

export const Disabled: Story = {
	render: () => <DatePicker.Root disabled placeholder="Project date" />,
};

export const Invalid: Story = {
	render: () => (
		<DatePicker.Root aria-invalid placeholder="Project date (required)" />
	),
};

function RangeDatePicker() {
	const [selectedRange, setSelectedRange] = useState<DateRange | null>({
		from: new Date(2026, 5, 9),
		to: new Date(2026, 5, 13),
	});

	return (
		<DatePicker.Range
			value={selectedRange}
			onValueChange={setSelectedRange}
			placeholder="Project window"
		/>
	);
}

export const Range: Story = {
	render: () => <RangeDatePicker />,
};

function CompactRangeDatePicker() {
	const [selectedRange, setSelectedRange] = useState<DateRange | null>(null);

	// A short numeric date keeps both range ends compact (e.g. 6/9/2026); a single
	// month fits narrow layouts like a filter bar.
	return (
		<DatePicker.Range
			formatOptions={{ dateStyle: "short" }}
			value={selectedRange}
			onValueChange={setSelectedRange}
			placeholder="Filter by period"
			calendarProps={{
				defaultMonth: new Date(2026, 5, 1),
				numberOfMonths: 1,
			}}
		/>
	);
}

export const CompactRange: Story = {
	render: () => <CompactRangeDatePicker />,
};
