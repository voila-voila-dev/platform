import {
	BellIcon,
	BriefcaseIcon,
	BuildingsIcon,
	ChartBarIcon,
	CheckCircleIcon,
	FileTextIcon,
	TrophyIcon,
	UserCheckIcon,
} from "@phosphor-icons/react";
import { StepTracks } from "@voila.dev/ui/landing";

const clientSteps = [
	{
		icon: FileTextIcon,
		title: "Post your project",
		description: "Scope, budget, timeline and the profile you're looking for.",
	},
	{
		icon: UserCheckIcon,
		title: "Select your freelancer",
		description: "Choose your expert among the profiles that applied.",
	},
	{
		icon: CheckCircleIcon,
		title: "Receive the deliverable",
		description: "Get the project report and sign off on the work.",
	},
];

const freelancerSteps = [
	{
		icon: BellIcon,
		title: "Stay in the loop",
		description:
			"Get a targeted alert and apply if the project appeals to you.",
	},
	{
		icon: TrophyIcon,
		title: "Deliver the work",
		description: "Join the adventure and do what you do best.",
	},
	{
		icon: ChartBarIcon,
		title: "Track your engagements",
		description: "Invoicing and analytics: the admin work is simplified.",
	},
];

export function Default() {
	return (
		<StepTracks.Root>
			<StepTracks.Track tone="highlight">
				<StepTracks.Header>
					<StepTracks.HeaderIcon>
						<BuildingsIcon />
					</StepTracks.HeaderIcon>
					<StepTracks.HeaderText>
						<StepTracks.HeaderTitle>Client</StepTracks.HeaderTitle>
						<StepTracks.HeaderSubtitle>
							You're staffing a project
						</StepTracks.HeaderSubtitle>
					</StepTracks.HeaderText>
				</StepTracks.Header>
				<StepTracks.Steps>
					{clientSteps.map((step, index) => {
						const Icon = step.icon;
						return (
							<StepTracks.Step key={step.title}>
								<StepTracks.StepIcon number={index + 1}>
									<Icon />
								</StepTracks.StepIcon>
								<StepTracks.Body>
									<StepTracks.BodyTitle>{step.title}</StepTracks.BodyTitle>
									<StepTracks.BodyDescription>
										{step.description}
									</StepTracks.BodyDescription>
								</StepTracks.Body>
							</StepTracks.Step>
						);
					})}
				</StepTracks.Steps>
			</StepTracks.Track>
			<StepTracks.Track tone="brand">
				<StepTracks.Header>
					<StepTracks.HeaderIcon>
						<BriefcaseIcon />
					</StepTracks.HeaderIcon>
					<StepTracks.HeaderText>
						<StepTracks.HeaderTitle>
							Independent freelancer
						</StepTracks.HeaderTitle>
						<StepTracks.HeaderSubtitle>
							You work as a freelancer
						</StepTracks.HeaderSubtitle>
					</StepTracks.HeaderText>
				</StepTracks.Header>
				<StepTracks.Steps>
					{freelancerSteps.map((step, index) => {
						const Icon = step.icon;
						return (
							<StepTracks.Step key={step.title}>
								<StepTracks.StepIcon number={index + 1}>
									<Icon />
								</StepTracks.StepIcon>
								<StepTracks.Body>
									<StepTracks.BodyTitle>{step.title}</StepTracks.BodyTitle>
									<StepTracks.BodyDescription>
										{step.description}
									</StepTracks.BodyDescription>
								</StepTracks.Body>
							</StepTracks.Step>
						);
					})}
				</StepTracks.Steps>
			</StepTracks.Track>
		</StepTracks.Root>
	);
}
