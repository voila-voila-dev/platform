import {
	BellIcon,
	BuildingsIcon,
	ChartBarIcon,
	FileTextIcon,
	HeartbeatIcon,
	StethoscopeIcon,
	TrophyIcon,
	UserCheckIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { StepTracks } from "@voila.dev/ui-landing/components/step-tracks";
import { helperTrack, performerTrack } from "./landing-fixtures";

const meta = {
	title: "Landing/StepTracks",
	component: StepTracks.Root,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
} satisfies Meta<typeof StepTracks.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

const performerIcons = [FileTextIcon, UserCheckIcon, HeartbeatIcon];
const helperIcons = [BellIcon, TrophyIcon, ChartBarIcon];

/** Reproduces the original Astro site's `section-how-it-works.astro`. */
export const TwoTracks: Story = {
	render: () => (
		<StepTracks.Root>
			<StepTracks.Track tone="organization">
				<StepTracks.Header>
					<StepTracks.HeaderIcon>
						<BuildingsIcon />
					</StepTracks.HeaderIcon>
					<StepTracks.HeaderText>
						<StepTracks.HeaderTitle>
							{performerTrack.label}
						</StepTracks.HeaderTitle>
						<StepTracks.HeaderSubtitle>
							{performerTrack.subtitle}
						</StepTracks.HeaderSubtitle>
					</StepTracks.HeaderText>
				</StepTracks.Header>
				<StepTracks.Steps>
					{performerTrack.steps.map((step, index) => {
						const Icon = performerIcons[index] ?? FileTextIcon;
						return (
							<StepTracks.Step
								key={step.title}
								style={{ animationDelay: `${index * 0.1}s` }}
							>
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

			<StepTracks.Track tone="provider" style={{ animationDelay: "0.15s" }}>
				<StepTracks.Header>
					<StepTracks.HeaderIcon>
						<StethoscopeIcon />
					</StepTracks.HeaderIcon>
					<StepTracks.HeaderText>
						<StepTracks.HeaderTitle>{helperTrack.label}</StepTracks.HeaderTitle>
						<StepTracks.HeaderSubtitle>
							{helperTrack.subtitle}
						</StepTracks.HeaderSubtitle>
					</StepTracks.HeaderText>
				</StepTracks.Header>
				<StepTracks.Steps>
					{helperTrack.steps.map((step, index) => {
						const Icon = helperIcons[index] ?? BellIcon;
						return (
							<StepTracks.Step
								key={step.title}
								style={{ animationDelay: `${(3 + index) * 0.1}s` }}
							>
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
	),
};
