import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { ResponsiveDatePicker } from "@voila.dev/ui/responsive-date-picker";
import { useState } from "react";

/**
 * One date field, two surfaces: the composed calendar popover on desktop and
 * the OS date picker under the 768px breakpoint. Resize the Storybook viewport
 * below 768px to see the native field take over — the selection carries across.
 */
const meta = {
	title: "UI/ResponsiveDatePicker",
	component: ResponsiveDatePicker.Root,
	tags: ["autodocs"],
	parameters: {
		docs: {
			description: {
				component:
					"Resize the viewport below 768px to swap the calendar popover for the OS date picker.",
			},
		},
	},
} satisfies Meta<typeof ResponsiveDatePicker.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const [date, setDate] = useState<Date | null>(new Date(2026, 5, 20));
		return (
			<div className="w-72">
				<ResponsiveDatePicker.Root
					value={date}
					onValueChange={setDate}
					placeholder="Project date"
					className="w-full"
				/>
			</div>
		);
	},
};

export const BirthDate: Story = {
	render: () => {
		const [date, setDate] = useState<Date | null>(null);
		return (
			<div className="w-72">
				<ResponsiveDatePicker.Root
					value={date}
					onValueChange={setDate}
					locale="fr-FR"
					placeholder="Date de naissance"
					min={new Date(1900, 0, 1)}
					max={new Date()}
					className="w-full"
				/>
			</div>
		);
	},
};

export const Invalid: Story = {
	render: () => {
		const [date, setDate] = useState<Date | null>(null);
		return (
			<div className="w-72">
				<ResponsiveDatePicker.Root
					value={date}
					onValueChange={setDate}
					placeholder="Start date"
					className="w-full"
					aria-invalid
				/>
			</div>
		);
	},
};

export const Disabled: Story = {
	render: () => (
		<div className="w-72">
			<ResponsiveDatePicker.Root
				value={new Date(2026, 5, 20)}
				placeholder="Project date"
				className="w-full"
				disabled
			/>
		</div>
	),
};
