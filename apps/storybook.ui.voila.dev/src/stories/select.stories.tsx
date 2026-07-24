import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@voila.dev/ui/components/select";

const meta = {
	title: "UI/Select",
	component: Select,
	tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Select>
			<SelectTrigger className="w-56">
				<SelectValue placeholder="Select a role" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="designer">Designer</SelectItem>
				<SelectItem value="developer">Developer</SelectItem>
				<SelectItem value="copywriter">Copywriter</SelectItem>
				<SelectItem value="data-analyst">Data analyst</SelectItem>
			</SelectContent>
		</Select>
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
		<Select defaultValue="design-sprint" items={projectTypeItems}>
			<SelectTrigger className="w-64">
				<SelectValue placeholder="Select a project type" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Marketing</SelectLabel>
					<SelectItem value="brand-refresh">Brand refresh</SelectItem>
					<SelectItem value="landing-page">Landing page</SelectItem>
				</SelectGroup>
				<SelectSeparator />
				<SelectGroup>
					<SelectLabel>Product</SelectLabel>
					<SelectItem value="design-sprint">Design sprint</SelectItem>
					<SelectItem value="code-review">Code review</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	),
};

export const Disabled: Story = {
	render: () => (
		<Select disabled>
			<SelectTrigger className="w-56">
				<SelectValue placeholder="Select a role" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="designer">Designer</SelectItem>
			</SelectContent>
		</Select>
	),
};
