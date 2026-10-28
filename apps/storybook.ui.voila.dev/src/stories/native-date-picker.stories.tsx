import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { NativeDatePicker } from "@voila.dev/ui/native-date-picker";

const meta = {
	title: "UI/NativeDatePicker",
	component: NativeDatePicker.Date,
	tags: ["autodocs"],
} satisfies Meta<typeof NativeDatePicker.Date>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <NativeDatePicker.Date defaultValue="2026-06-20" />,
};

export const Time: Story = {
	render: () => <NativeDatePicker.Time defaultValue="14:30" />,
};

export const DateTime: Story = {
	render: () => <NativeDatePicker.DateTime defaultValue="2026-06-20T14:30" />,
};

export const WithMinMax: Story = {
	render: () => (
		// Constrained to June 2026 — e.g. a project must start within the month.
		<NativeDatePicker.Date min="2026-06-01" max="2026-06-30" />
	),
};

export const Small: Story = {
	render: () => (
		<div className="flex flex-col gap-2">
			<NativeDatePicker.Date size="sm" defaultValue="2026-06-20" />
			<NativeDatePicker.Time size="sm" defaultValue="14:30" />
		</div>
	),
};

export const Invalid: Story = {
	render: () => <NativeDatePicker.Date aria-invalid required />,
};

export const Disabled: Story = {
	render: () => <NativeDatePicker.Date disabled defaultValue="2026-06-20" />,
};

export const FullWidth: Story = {
	render: () => (
		<div className="w-80">
			<NativeDatePicker.Date
				wrapperClassName="w-full"
				defaultValue="2026-06-20"
			/>
		</div>
	),
};
