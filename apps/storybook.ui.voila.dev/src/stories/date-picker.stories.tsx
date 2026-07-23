import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	DatePicker,
	type DateRange,
	DateRangePicker,
} from "@voila.dev/ui/components/date-picker";
import { useState } from "react";

const meta = {
	title: "UI/DatePicker",
	component: DatePicker,
	tags: ["autodocs"],
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

function SingleDatePicker() {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	return (
		<DatePicker
			value={selectedDate}
			onValueChange={setSelectedDate}
			placeholder="Mission date"
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

	return <DatePicker value={selectedDate} onValueChange={setSelectedDate} />;
}

export const WithValue: Story = {
	render: () => <PreselectedDatePicker />,
};

function FrenchLocaleDatePicker() {
	const [selectedDate, setSelectedDate] = useState<Date | null>(
		new Date(2026, 5, 20),
	);

	return (
		<DatePicker
			locale="fr-FR"
			value={selectedDate}
			onValueChange={setSelectedDate}
			placeholder="Date de la mission"
		/>
	);
}

export const FrenchLocale: Story = {
	render: () => <FrenchLocaleDatePicker />,
};

function DisabledDaysDatePicker() {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	// Weekends are disabled — e.g. weekday-only mission scheduling.
	return (
		<DatePicker
			value={selectedDate}
			onValueChange={setSelectedDate}
			placeholder="Weekday mission date"
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
	render: () => <DatePicker disabled placeholder="Mission date" />,
};

export const Invalid: Story = {
	render: () => (
		<DatePicker aria-invalid placeholder="Mission date (required)" />
	),
};

function RangeDatePicker() {
	const [selectedRange, setSelectedRange] = useState<DateRange | null>({
		from: new Date(2026, 5, 9),
		to: new Date(2026, 5, 13),
	});

	return (
		<DateRangePicker
			value={selectedRange}
			onValueChange={setSelectedRange}
			placeholder="Mission window"
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
		<DateRangePicker
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
