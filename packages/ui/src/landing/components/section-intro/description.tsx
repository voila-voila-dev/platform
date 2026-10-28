import type * as React from "react";
import { Text } from "#/landing/components/text.tsx";

interface Props extends React.ComponentProps<typeof Text> {}

export function SectionIntroDescription({ className, ...props }: Props) {
	return (
		<Text
			data-slot="section-intro-description"
			variant="lead"
			align="center"
			className={className}
			{...props}
		/>
	);
}
