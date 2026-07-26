import { StepTracksBody } from "#/landing/components/step-tracks/body.tsx";
import { StepTracksBodyDescription } from "#/landing/components/step-tracks/body-description.tsx";
import { StepTracksBodyTitle } from "#/landing/components/step-tracks/body-title.tsx";
import { StepTracksHeader } from "#/landing/components/step-tracks/header.tsx";
import { StepTracksHeaderIcon } from "#/landing/components/step-tracks/header-icon.tsx";
import { StepTracksHeaderSubtitle } from "#/landing/components/step-tracks/header-subtitle.tsx";
import { StepTracksHeaderText } from "#/landing/components/step-tracks/header-text.tsx";
import { StepTracksHeaderTitle } from "#/landing/components/step-tracks/header-title.tsx";
import { StepTracksRoot } from "#/landing/components/step-tracks/root.tsx";
import { StepTracksStep } from "#/landing/components/step-tracks/step.tsx";
import { StepTracksStepIcon } from "#/landing/components/step-tracks/step-icon.tsx";
import { StepTracksSteps } from "#/landing/components/step-tracks/steps.tsx";
import { StepTracksTrack } from "#/landing/components/step-tracks/track.tsx";

/**
 * Compose: `Root > Track (tone) > Header (HeaderIcon + HeaderText >
 * HeaderTitle/HeaderSubtitle) + Steps > Step (StepIcon number + Body >
 * BodyTitle/BodyDescription)`.
 */
export const StepTracks = {
	Root: StepTracksRoot,
	Track: StepTracksTrack,
	Header: StepTracksHeader,
	HeaderIcon: StepTracksHeaderIcon,
	HeaderText: StepTracksHeaderText,
	HeaderTitle: StepTracksHeaderTitle,
	HeaderSubtitle: StepTracksHeaderSubtitle,
	Steps: StepTracksSteps,
	Step: StepTracksStep,
	StepIcon: StepTracksStepIcon,
	Body: StepTracksBody,
	BodyTitle: StepTracksBodyTitle,
	BodyDescription: StepTracksBodyDescription,
};
