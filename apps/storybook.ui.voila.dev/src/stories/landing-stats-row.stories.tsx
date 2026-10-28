import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { StatsRow } from "@voila.dev/ui/landing";
import { Fragment } from "react";
import { heroCopy } from "./landing-fixtures";

const meta = {
	title: "Landing/StatsRow",
	component: StatsRow.Root,
	tags: ["autodocs"],
	argTypes: {
		bordered: {
			control: "boolean",
		},
	},
	args: {
		bordered: true,
	},
	render: (args) => (
		<StatsRow.Root {...args}>
			{heroCopy.stats.map((stat, index) => (
				<Fragment key={stat.label}>
					{index > 0 ? <StatsRow.Divider /> : null}
					<StatsRow.Item>
						<StatsRow.Value>{stat.value}</StatsRow.Value>
						<StatsRow.Label>{stat.label}</StatsRow.Label>
					</StatsRow.Item>
				</Fragment>
			))}
		</StatsRow.Root>
	),
} satisfies Meta<typeof StatsRow.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Unbordered: Story = {
	args: {
		bordered: false,
	},
};
