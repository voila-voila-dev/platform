import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import { StickyActionBar } from "@voila.dev/ui/sticky-action-bar";

const meta = {
	title: "UI/StickyActionBar",
	component: StickyActionBar,
	tags: ["autodocs"],
	// The bar is mobile-first: it hides from `md` up unless told otherwise, so
	// the stories keep it visible on every breakpoint for the docs canvas.
	args: {
		hideOnDesktop: false,
	},
} satisfies Meta<typeof StickyActionBar>;

export default meta;

type Story = StoryObj<typeof meta>;

function ScrollablePage({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative h-80 w-full max-w-md overflow-y-auto rounded-lg border">
			<div className="flex flex-col gap-3 p-4 pb-2">
				{Array.from({ length: 12 }, (_, index) => (
					<p key={String(index)} className="text-sm text-muted-foreground">
						Project detail {index + 1} — landing page redesign for the spring
						launch, kickoff call 30 minutes before the sprint starts.
					</p>
				))}
			</div>
			{children}
		</div>
	);
}

export const Default: Story = {
	render: (args) => (
		<ScrollablePage>
			<StickyActionBar {...args}>
				<Button>Apply</Button>
			</StickyActionBar>
		</ScrollablePage>
	),
};

export const TwoActions: Story = {
	render: (args) => (
		<ScrollablePage>
			<StickyActionBar {...args}>
				<Button variant="outline">Contact</Button>
				<Button>Apply</Button>
			</StickyActionBar>
		</ScrollablePage>
	),
};

// Default behavior: hidden from the `md` breakpoint up.
export const MobileOnly: Story = {
	args: {
		hideOnDesktop: true,
	},
	render: (args) => (
		<ScrollablePage>
			<StickyActionBar {...args}>
				<Button>Apply</Button>
			</StickyActionBar>
		</ScrollablePage>
	),
};
