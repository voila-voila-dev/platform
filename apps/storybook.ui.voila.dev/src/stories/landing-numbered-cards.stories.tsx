import { EnvelopeIcon, FileTextIcon, TruckIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	NumberedCards,
	numberedCardsColumnsOptions,
} from "@voila.dev/ui/landing/numbered-cards";
import { toneOptions } from "@voila.dev/ui/landing/tones";

const meta = {
	title: "Landing/NumberedCards",
	component: NumberedCards.Root,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		tone: {
			control: "select",
			options: toneOptions,
		},
		columns: {
			control: "select",
			options: numberedCardsColumnsOptions,
		},
	},
	args: {
		tone: "highlight",
	},
} satisfies Meta<typeof NumberedCards.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

const steps = [
	{
		icon: EnvelopeIcon,
		title: "Send your request",
		description:
			"Describe what your project needs: we prepare a quote tailored to your team.",
	},
	{
		icon: FileTextIcon,
		title: "Approve the quote",
		description:
			"Receive a clear, detailed offer, with no commitment, within 48 hours.",
	},
	{
		icon: TruckIcon,
		title: "Receive your deliverables",
		description:
			"Delivered straight to your team, with complete tracking of your order.",
	},
];

/** Reproduces the original Astro site's how-ordering-works section. */
export const Default: Story = {
	render: (args) => (
		<NumberedCards.Root {...args}>
			{steps.map((step, index) => {
				const Icon = step.icon;
				return (
					<NumberedCards.Card
						key={step.title}
						style={{ animationDelay: `${index * 0.15}s` }}
					>
						<NumberedCards.CardHeader>
							<NumberedCards.CardIcon>
								<Icon />
							</NumberedCards.CardIcon>
							<NumberedCards.CardLabel>
								Step {index + 1}
							</NumberedCards.CardLabel>
						</NumberedCards.CardHeader>
						<NumberedCards.CardTitle>{step.title}</NumberedCards.CardTitle>
						<NumberedCards.CardDescription>
							{step.description}
						</NumberedCards.CardDescription>
					</NumberedCards.Card>
				);
			})}
		</NumberedCards.Root>
	),
};
