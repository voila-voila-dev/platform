interface Props extends React.ComponentProps<"div"> {}

export function StepTracksHeaderText({ className, ...props }: Props) {
	return (
		<div data-slot="step-tracks-header-text" className={className} {...props} />
	);
}

import type * as React from "react";
