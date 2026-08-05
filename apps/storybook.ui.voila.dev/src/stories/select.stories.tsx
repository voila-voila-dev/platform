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

const templateItems = {
	none: "No template",
	"fb-form": "Consumables - Organisation/Provider - Facebook Form",
	urgency: "Consumables - Provider - Existing - Urgency",
};

/** Names typed by a user get long. The trigger shrinks to the field it sits in
 * and ellipsises rather than pushing the form wider, and the popup takes the
 * width its longest option needs. */
export const LongValueInANarrowField: Story = {
	render: () => (
		<div className="w-[340px] rounded-lg border p-4">
			<Select.Root defaultValue="fb-form" items={templateItems}>
				<Select.Trigger className="w-full">
					<Select.Value />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="none">No template</Select.Item>
					<Select.Item value="fb-form">
						Consumables - Organisation/Provider - Facebook Form
					</Select.Item>
					<Select.Item value="urgency">
						Consumables - Provider - Existing - Urgency
					</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>
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
