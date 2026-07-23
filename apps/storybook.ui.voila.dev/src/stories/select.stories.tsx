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
				<SelectValue placeholder="Select a specialty" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="physiotherapist">Physiotherapist</SelectItem>
				<SelectItem value="osteopath">Osteopath</SelectItem>
				<SelectItem value="nurse">Nurse</SelectItem>
				<SelectItem value="sports-doctor">Sports doctor</SelectItem>
			</SelectContent>
		</Select>
	),
};

/* `items` is what makes the trigger show "Recovery session" instead of the
 * raw "recovery-session" value — regression story for the labeled value. */
const missionTypeItems = {
	"pitch-side-cover": "Pitch-side cover",
	"post-match-care": "Post-match care",
	"recovery-session": "Recovery session",
	"injury-screening": "Injury screening",
};

export const WithGroups: Story = {
	render: () => (
		<Select defaultValue="recovery-session" items={missionTypeItems}>
			<SelectTrigger className="w-64">
				<SelectValue placeholder="Select a mission type" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Match day</SelectLabel>
					<SelectItem value="pitch-side-cover">Pitch-side cover</SelectItem>
					<SelectItem value="post-match-care">Post-match care</SelectItem>
				</SelectGroup>
				<SelectSeparator />
				<SelectGroup>
					<SelectLabel>Training</SelectLabel>
					<SelectItem value="recovery-session">Recovery session</SelectItem>
					<SelectItem value="injury-screening">Injury screening</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	),
};

export const Disabled: Story = {
	render: () => (
		<Select disabled>
			<SelectTrigger className="w-56">
				<SelectValue placeholder="Select a specialty" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="physiotherapist">Physiotherapist</SelectItem>
			</SelectContent>
		</Select>
	),
};
