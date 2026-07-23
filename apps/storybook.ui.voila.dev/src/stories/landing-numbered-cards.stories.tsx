import { EnvelopeIcon, FileTextIcon, TruckIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	NumberedCards,
	numberedCardsColumnsOptions,
} from "@voila.dev/ui-landing/components/numbered-cards";
import { toneOptions } from "@voila.dev/ui-landing/lib/tones";

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
		tone: "organization",
	},
} satisfies Meta<typeof NumberedCards.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

const steps = [
	{
		icon: EnvelopeIcon,
		title: "Envoyez votre demande",
		description:
			"Décrivez vos besoins en matériel médical : nous préparons un devis adapté à votre structure.",
	},
	{
		icon: FileTextIcon,
		title: "Validez le devis",
		description:
			"Recevez une offre claire et détaillée, sans engagement, sous 48 heures.",
	},
	{
		icon: TruckIcon,
		title: "Recevez votre matériel",
		description:
			"Livraison directe au club, avec un suivi complet de votre commande.",
	},
];

/** Reproduces the original Astro site's `section-equipment-how.astro`. */
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
								Étape {index + 1}
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
