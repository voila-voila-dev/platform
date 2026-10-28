import { StepTracksBody } from "#/components/step-tracks/body.tsx";
import { StepTracksBodyDescription } from "#/components/step-tracks/body-description.tsx";
import { StepTracksBodyTitle } from "#/components/step-tracks/body-title.tsx";
import { StepTracksHeader } from "#/components/step-tracks/header.tsx";
import { StepTracksHeaderIcon } from "#/components/step-tracks/header-icon.tsx";
import { StepTracksHeaderSubtitle } from "#/components/step-tracks/header-subtitle.tsx";
import { StepTracksHeaderText } from "#/components/step-tracks/header-text.tsx";
import { StepTracksHeaderTitle } from "#/components/step-tracks/header-title.tsx";
import { StepTracksRoot } from "#/components/step-tracks/root.tsx";
import { StepTracksStep } from "#/components/step-tracks/step.tsx";
import { StepTracksStepIcon } from "#/components/step-tracks/step-icon.tsx";
import { StepTracksSteps } from "#/components/step-tracks/steps.tsx";
import { StepTracksTrack } from "#/components/step-tracks/track.tsx";

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
