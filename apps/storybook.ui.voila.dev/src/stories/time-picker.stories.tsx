import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { TimePicker } from "@voila.dev/ui/components/time-picker";
import { useState } from "react";

const meta = {
	title: "UI/TimePicker",
	component: TimePicker,
	tags: ["autodocs"],
} satisfies Meta<typeof TimePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

function DefaultTimePicker() {
	const [selectedTime, setSelectedTime] = useState<string | null>(null);

	return (
		<TimePicker
			value={selectedTime}
			onValueChange={setSelectedTime}
			placeholder="Start time"
		/>
	);
}

export const Default: Story = {
	render: () => <DefaultTimePicker />,
};

function PreselectedTimePicker() {
	const [selectedTime, setSelectedTime] = useState<string | null>("14:30");

	return <TimePicker value={selectedTime} onValueChange={setSelectedTime} />;
}

export const WithValue: Story = {
	render: () => <PreselectedTimePicker />,
};

function FrenchLocaleTimePicker() {
	const [selectedTime, setSelectedTime] = useState<string | null>("14:30");

	return (
		<TimePicker
			locale="fr-FR"
			value={selectedTime}
			onValueChange={setSelectedTime}
			placeholder="Heure de début"
		/>
	);
}

export const FrenchLocale: Story = {
	render: () => <FrenchLocaleTimePicker />,
};

function BusinessHoursTimePicker() {
	const [selectedTime, setSelectedTime] = useState<string | null>(null);

	// 15-minute slots inside business hours — e.g. a mission start time.
	return (
		<TimePicker
			min="08:00"
			max="20:00"
			step={15}
			value={selectedTime}
			onValueChange={setSelectedTime}
			placeholder="Mission start"
		/>
	);
}

export const BusinessHours: Story = {
	render: () => <BusinessHoursTimePicker />,
};

export const Disabled: Story = {
	render: () => <TimePicker disabled placeholder="Start time" />,
};

export const Invalid: Story = {
	render: () => <TimePicker aria-invalid placeholder="Start time (required)" />,
};
