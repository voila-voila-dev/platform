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
		<NativeSelect defaultValue="designer">
			<NativeSelectOption value="designer">Designer</NativeSelectOption>
			<NativeSelectOption value="developer">Developer</NativeSelectOption>
			<NativeSelectOption value="copywriter">Copywriter</NativeSelectOption>
		</NativeSelect>
	),
};

export const Grouped: Story = {
	render: () => (
		<NativeSelect defaultValue="branding">
			<NativeSelectOptGroup label="Design">
				<NativeSelectOption value="branding">Branding</NativeSelectOption>
				<NativeSelectOption value="product">Product design</NativeSelectOption>
				<NativeSelectOption value="motion">Motion design</NativeSelectOption>
			</NativeSelectOptGroup>
			<NativeSelectOptGroup label="Engineering">
				<NativeSelectOption value="frontend">Frontend</NativeSelectOption>
				<NativeSelectOption value="backend">Backend</NativeSelectOption>
			</NativeSelectOptGroup>
		</NativeSelect>
	),
};

export const SmallDisabled: Story = {
	render: () => (
		<NativeSelect size="sm" disabled defaultValue="designer">
			<NativeSelectOption value="designer">Designer</NativeSelectOption>
			<NativeSelectOption value="developer">Developer</NativeSelectOption>
		</NativeSelect>
	),
};

export const Invalid: Story = {
	render: () => (
		<NativeSelect aria-invalid defaultValue="designer">
			<NativeSelectOption value="designer">Designer</NativeSelectOption>
			<NativeSelectOption value="developer">Developer</NativeSelectOption>
			<NativeSelectOption value="copywriter">Copywriter</NativeSelectOption>
		</NativeSelect>
	),
};

export const FullWidthForm: Story = {
	render: () => (
		<div className="w-80">
			<NativeSelect defaultValue="designer">
				<NativeSelectOption value="designer">Designer</NativeSelectOption>
				<NativeSelectOption value="developer">Developer</NativeSelectOption>
				<NativeSelectOption value="copywriter">Copywriter</NativeSelectOption>
			</NativeSelect>
		</div>
	),
};
