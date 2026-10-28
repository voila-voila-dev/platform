import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { ScrollArea } from "@voila.dev/ui/scroll-area";

const meta = {
	title: "UI/ScrollArea",
	component: ScrollArea.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof ScrollArea.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

const projects: ReadonlyArray<string> = Array.from(
	{ length: 20 },
	(_, index) => `Project #${index + 1} — Landing page refresh`,
);

export const Default: Story = {
	render: () => (
		<ScrollArea.Root className="h-56 w-72 rounded-lg border">
			<div className="p-3">
				<p className="mb-2 text-sm font-medium">Upcoming projects</p>
				{projects.map((project) => (
					<div key={project} className="border-b py-2 text-sm last:border-b-0">
						{project}
					</div>
				))}
			</div>
		</ScrollArea.Root>
	),
};
