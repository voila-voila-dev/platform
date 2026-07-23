import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Calendar } from "@voila.dev/ui/components/calendar";
import { useState } from "react";

const meta = {
	title: "UI/Calendar",
	component: Calendar,
	tags: ["autodocs"],
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

function SingleSelectionCalendar() {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date(2026, 5, 20),
	);

	return (
		<Calendar
			mode="single"
			selected={selectedDate}
			onSelect={setSelectedDate}
			defaultMonth={new Date(2026, 5, 20)}
			className="rounded-lg border"
		/>
	);
}

export const Default: Story = {
	render: () => <SingleSelectionCalendar />,
};

type CalendarDateRange = { from: Date | undefined; to?: Date | undefined };

function RangeSelectionCalendar() {
	const [selectedRange, setSelectedRange] = useState<
		CalendarDateRange | undefined
	>({
		from: new Date(2026, 5, 9),
		to: new Date(2026, 5, 13),
	});

	return (
		<Calendar
			mode="range"
			selected={selectedRange}
			onSelect={setSelectedRange}
			defaultMonth={new Date(2026, 5, 9)}
			numberOfMonths={2}
			className="rounded-lg border"
		/>
	);
}

export const Range: Story = {
	render: () => <RangeSelectionCalendar />,
};

function DropdownCaptionCalendar() {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date(2026, 5, 20),
	);

	// Constrain the year dropdown to a sane "now ± 2y" window instead of the
	// react-day-picker default of ±100 years (1926–2026), which is meaningless
	// for mission scheduling.
	return (
		<Calendar
			mode="single"
			selected={selectedDate}
			onSelect={setSelectedDate}
			captionLayout="dropdown"
			defaultMonth={new Date(2026, 5, 1)}
			startMonth={new Date(2024, 0, 1)}
			endMonth={new Date(2028, 11, 31)}
			className="rounded-lg border"
		/>
	);
}

export const WithDropdownCaption: Story = {
	render: () => <DropdownCaptionCalendar />,
};

function FrenchLocaleCalendar() {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date(2026, 5, 20),
	);

	return (
		<Calendar
			mode="single"
			locale="fr-FR"
			selected={selectedDate}
			onSelect={setSelectedDate}
			defaultMonth={new Date(2026, 5, 20)}
			className="rounded-lg border"
		/>
	);
}

export const FrenchLocale: Story = {
	render: () => <FrenchLocaleCalendar />,
};

function DisabledDaysCalendar() {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date(2026, 5, 20),
	);

	return (
		<Calendar
			mode="single"
			selected={selectedDate}
			onSelect={setSelectedDate}
			defaultMonth={new Date(2026, 5, 1)}
			// Disable weekends across the visible month.
			disabled={{ dayOfWeek: [0, 6] }}
			className="rounded-lg border"
		/>
	);
}

export const DisabledDays: Story = {
	render: () => <DisabledDaysCalendar />,
};

function WeekNumbersCalendar() {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date(2026, 5, 20),
	);

	return (
		<Calendar
			mode="single"
			showWeekNumber
			selected={selectedDate}
			onSelect={setSelectedDate}
			defaultMonth={new Date(2026, 5, 1)}
			className="rounded-lg border"
		/>
	);
}

export const WithWeekNumbers: Story = {
	render: () => <WeekNumbersCalendar />,
};
