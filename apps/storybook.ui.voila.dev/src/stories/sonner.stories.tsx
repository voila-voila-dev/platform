import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import { Toaster, toast } from "@voila.dev/ui/sonner";

const meta = {
	title: "UI/Sonner",
	component: Toaster,
	tags: ["autodocs"],
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div>
			<Toaster />
			<Button
				variant="outline"
				onClick={() =>
					toast("Project published", {
						description: "Matching freelancers have been notified.",
					})
				}
			>
				Show toast
			</Button>
		</div>
	),
};

export const Types: Story = {
	render: () => (
		<div className="flex flex-wrap gap-4">
			<Toaster />
			<Button
				variant="outline"
				onClick={() => toast.success("Engagement confirmed")}
			>
				Success
			</Button>
			<Button
				variant="outline"
				onClick={() => toast.info("A freelancer applied to your project")}
			>
				Info
			</Button>
			<Button
				variant="outline"
				onClick={() => toast.warning("Project starts in less than 24 hours")}
			>
				Warning
			</Button>
			<Button
				variant="outline"
				onClick={() => toast.error("Payment could not be processed")}
			>
				Error
			</Button>
			<Button
				variant="outline"
				onClick={() => toast.loading("Publishing project…")}
			>
				Loading
			</Button>
		</div>
	),
};
