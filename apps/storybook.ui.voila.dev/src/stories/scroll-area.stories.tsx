import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { ScrollArea } from "@voila.dev/ui/components/scroll-area";

const meta = {
	title: "UI/ScrollArea",
	component: ScrollArea,
	tags: ["autodocs"],
} satisfies Meta<typeof ScrollArea>;

export default meta;

type Story = StoryObj<typeof meta>;

const missions: ReadonlyArray<string> = Array.from(
	{ length: 20 },
	(_, index) => `Mission #${index + 1} — Match day coverage`,
);

export const Default: Story = {
	render: () => (
		<ScrollArea className="h-56 w-72 rounded-lg border">
			<div className="p-3">
				<p className="mb-2 text-sm font-medium">Upcoming missions</p>
				{missions.map((mission) => (
					<div key={mission} className="border-b py-2 text-sm last:border-b-0">
						{mission}
					</div>
				))}
			</div>
		</ScrollArea>
	),
};
