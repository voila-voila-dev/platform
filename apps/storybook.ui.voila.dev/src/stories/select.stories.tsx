import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Select } from "@voila.dev/ui/select";

const meta = {
	title: "UI/Select",
	component: Select.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof Select.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Select.Root>
			<Select.Trigger className="w-56">
				<Select.Value placeholder="Select a role" />
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="designer">Designer</Select.Item>
				<Select.Item value="developer">Developer</Select.Item>
				<Select.Item value="copywriter">Copywriter</Select.Item>
				<Select.Item value="data-analyst">Data analyst</Select.Item>
			</Select.Content>
		</Select.Root>
	),
};

/* `items` is what makes the trigger show "Design sprint" instead of the
 * raw "design-sprint" value — regression story for the labeled value. */
const projectTypeItems = {
	"brand-refresh": "Brand refresh",
	"landing-page": "Landing page",
	"design-sprint": "Design sprint",
	"code-review": "Code review",
};

export const WithGroups: Story = {
	render: () => (
		<Select.Root defaultValue="design-sprint" items={projectTypeItems}>
			<Select.Trigger className="w-64">
				<Select.Value placeholder="Select a project type" />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Marketing</Select.Label>
					<Select.Item value="brand-refresh">Brand refresh</Select.Item>
					<Select.Item value="landing-page">Landing page</Select.Item>
				</Select.Group>
				<Select.Separator />
				<Select.Group>
					<Select.Label>Product</Select.Label>
					<Select.Item value="design-sprint">Design sprint</Select.Item>
					<Select.Item value="code-review">Code review</Select.Item>
				</Select.Group>
			</Select.Content>
		</Select.Root>
	),
};

export const Disabled: Story = {
	render: () => (
		<Select.Root disabled>
			<Select.Trigger className="w-56">
				<Select.Value placeholder="Select a role" />
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="designer">Designer</Select.Item>
			</Select.Content>
		</Select.Root>
	),
};
