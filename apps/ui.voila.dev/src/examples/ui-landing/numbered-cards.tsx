import {
	EnvelopeIcon,
	FileTextIcon,
	RocketLaunchIcon,
} from "@phosphor-icons/react";
import { NumberedCards } from "@voila.dev/ui/landing";

const orderSteps = [
	{
		icon: EnvelopeIcon,
		title: "Send your brief",
		description: "Describe your needs: we prepare a tailored quote.",
	},
	{
		icon: FileTextIcon,
		title: "Approve the quote",
		description: "A clear, detailed offer, with no commitment, within 48 h.",
	},
	{
		icon: RocketLaunchIcon,
		title: "Kick off the project",
		description: "A vetted freelancer starts, with full progress tracking.",
	},
];

export function Default() {
	return (
		<NumberedCards.Root tone="highlight">
			{orderSteps.map((step, index) => {
				const Icon = step.icon;
				return (
					<NumberedCards.Card key={step.title}>
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
	);
}
