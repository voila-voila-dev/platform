import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { CopyableText } from "@voila.dev/ui/components/copyable-text";

const meta = {
	title: "UI/CopyableText",
	component: CopyableText,
	tags: ["autodocs"],
	args: {
		value: "camille@example.com",
	},
} satisfies Meta<typeof CopyableText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Muted: Story = {
	args: { value: "+33690972105", muted: true },
};

/** A truncated label that copies the full value — how admin ids are shown. */
export const TruncatedLabel: Story = {
	args: {
		value: "019f7557-04dd-7000-b488-d3f9a2647960",
		label: "019f7557",
		className: "text-xs",
	},
};
