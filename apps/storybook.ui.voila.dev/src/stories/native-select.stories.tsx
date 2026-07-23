import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	NativeSelect,
	NativeSelectOptGroup,
	NativeSelectOption,
} from "@voila.dev/ui/components/native-select";

const meta = {
	title: "UI/NativeSelect",
	component: NativeSelect,
	tags: ["autodocs"],
} satisfies Meta<typeof NativeSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<NativeSelect defaultValue="physiotherapist">
			<NativeSelectOption value="physiotherapist">
				Physiotherapist
			</NativeSelectOption>
			<NativeSelectOption value="osteopath">Osteopath</NativeSelectOption>
			<NativeSelectOption value="nurse">Nurse</NativeSelectOption>
		</NativeSelect>
	),
};

export const Grouped: Story = {
	render: () => (
		<NativeSelect defaultValue="rugby">
			<NativeSelectOptGroup label="Team sports">
				<NativeSelectOption value="rugby">Rugby</NativeSelectOption>
				<NativeSelectOption value="football">Football</NativeSelectOption>
				<NativeSelectOption value="handball">Handball</NativeSelectOption>
			</NativeSelectOptGroup>
			<NativeSelectOptGroup label="Individual sports">
				<NativeSelectOption value="athletics">Athletics</NativeSelectOption>
				<NativeSelectOption value="tennis">Tennis</NativeSelectOption>
			</NativeSelectOptGroup>
		</NativeSelect>
	),
};

export const SmallDisabled: Story = {
	render: () => (
		<NativeSelect size="sm" disabled defaultValue="physiotherapist">
			<NativeSelectOption value="physiotherapist">
				Physiotherapist
			</NativeSelectOption>
			<NativeSelectOption value="osteopath">Osteopath</NativeSelectOption>
		</NativeSelect>
	),
};

export const Invalid: Story = {
	render: () => (
		<NativeSelect aria-invalid defaultValue="physiotherapist">
			<NativeSelectOption value="physiotherapist">
				Physiotherapist
			</NativeSelectOption>
			<NativeSelectOption value="osteopath">Osteopath</NativeSelectOption>
			<NativeSelectOption value="nurse">Nurse</NativeSelectOption>
		</NativeSelect>
	),
};

export const FullWidthForm: Story = {
	render: () => (
		<div className="w-80">
			<NativeSelect defaultValue="physiotherapist">
				<NativeSelectOption value="physiotherapist">
					Physiotherapist
				</NativeSelectOption>
				<NativeSelectOption value="osteopath">Osteopath</NativeSelectOption>
				<NativeSelectOption value="nurse">Nurse</NativeSelectOption>
			</NativeSelect>
		</div>
	),
};
