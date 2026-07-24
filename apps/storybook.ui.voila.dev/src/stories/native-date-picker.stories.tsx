import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	NativeDatePicker,
	NativeDateTimePicker,
	NativeTimePicker,
} from "@voila.dev/ui/components/native-date-picker";

const meta = {
	title: "UI/NativeDatePicker",
	component: NativeDatePicker,
	tags: ["autodocs"],
} satisfies Meta<typeof NativeDatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <NativeDatePicker defaultValue="2026-06-20" />,
};

export const Time: Story = {
	render: () => <NativeTimePicker defaultValue="14:30" />,
};

export const DateTime: Story = {
	render: () => <NativeDateTimePicker defaultValue="2026-06-20T14:30" />,
};

export const WithMinMax: Story = {
	render: () => (
		// Constrained to June 2026 — e.g. a project must start within the month.
		<NativeDatePicker min="2026-06-01" max="2026-06-30" />
	),
};

export const Small: Story = {
	render: () => (
		<div className="flex flex-col gap-2">
			<NativeDatePicker size="sm" defaultValue="2026-06-20" />
			<NativeTimePicker size="sm" defaultValue="14:30" />
		</div>
	),
};

export const Invalid: Story = {
	render: () => <NativeDatePicker aria-invalid required />,
};

export const Disabled: Story = {
	render: () => <NativeDatePicker disabled defaultValue="2026-06-20" />,
};

export const FullWidth: Story = {
	render: () => (
		<div className="w-80">
			<NativeDatePicker wrapperClassName="w-full" defaultValue="2026-06-20" />
		</div>
	),
};
