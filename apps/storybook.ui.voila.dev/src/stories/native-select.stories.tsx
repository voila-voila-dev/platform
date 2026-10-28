import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { NativeSelect } from "@voila.dev/ui/native-select";

const meta = {
	title: "UI/NativeSelect",
	component: NativeSelect.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof NativeSelect.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<NativeSelect.Root defaultValue="designer">
			<NativeSelect.Option value="designer">Designer</NativeSelect.Option>
			<NativeSelect.Option value="developer">Developer</NativeSelect.Option>
			<NativeSelect.Option value="copywriter">Copywriter</NativeSelect.Option>
		</NativeSelect.Root>
	),
};

export const Grouped: Story = {
	render: () => (
		<NativeSelect.Root defaultValue="branding">
			<NativeSelect.OptGroup label="Design">
				<NativeSelect.Option value="branding">Branding</NativeSelect.Option>
				<NativeSelect.Option value="product">
					Product design
				</NativeSelect.Option>
				<NativeSelect.Option value="motion">Motion design</NativeSelect.Option>
			</NativeSelect.OptGroup>
			<NativeSelect.OptGroup label="Engineering">
				<NativeSelect.Option value="frontend">Frontend</NativeSelect.Option>
				<NativeSelect.Option value="backend">Backend</NativeSelect.Option>
			</NativeSelect.OptGroup>
		</NativeSelect.Root>
	),
};

export const SmallDisabled: Story = {
	render: () => (
		<NativeSelect.Root size="sm" disabled defaultValue="designer">
			<NativeSelect.Option value="designer">Designer</NativeSelect.Option>
			<NativeSelect.Option value="developer">Developer</NativeSelect.Option>
		</NativeSelect.Root>
	),
};

export const Invalid: Story = {
	render: () => (
		<NativeSelect.Root aria-invalid defaultValue="designer">
			<NativeSelect.Option value="designer">Designer</NativeSelect.Option>
			<NativeSelect.Option value="developer">Developer</NativeSelect.Option>
			<NativeSelect.Option value="copywriter">Copywriter</NativeSelect.Option>
		</NativeSelect.Root>
	),
};

export const FullWidthForm: Story = {
	render: () => (
		<div className="w-80">
			<NativeSelect.Root defaultValue="designer">
				<NativeSelect.Option value="designer">Designer</NativeSelect.Option>
				<NativeSelect.Option value="developer">Developer</NativeSelect.Option>
				<NativeSelect.Option value="copywriter">Copywriter</NativeSelect.Option>
			</NativeSelect.Root>
		</div>
	),
};
