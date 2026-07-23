import { ArrowRightIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import { CtaBanner } from "@voila.dev/ui-landing/components/cta-banner";
import { ctaBanner } from "./landing-fixtures";

const meta = {
	title: "Landing/CtaBanner",
	component: CtaBanner.Root,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof CtaBanner.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Reproduces the original Astro site's `shared/cta-banner.astro`. */
export const Default: Story = {
	render: () => (
		<CtaBanner.Root>
			<CtaBanner.Title>{ctaBanner.title}</CtaBanner.Title>
			<CtaBanner.Description>{ctaBanner.description}</CtaBanner.Description>
			<CtaBanner.Actions>
				<Button size="lg" variant="secondary" className="group">
					Je suis un club
					<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</Button>
				<Button
					size="lg"
					variant="outline"
					className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
				>
					Je suis professionnel de santé
				</Button>
			</CtaBanner.Actions>
		</CtaBanner.Root>
	),
};
