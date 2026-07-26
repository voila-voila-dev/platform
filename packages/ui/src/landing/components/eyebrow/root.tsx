import type * as React from "react";
import { EyebrowToneContext } from "#/landing/components/eyebrow/context/eyebrow-context.ts";
import { type Tone, toneTintBackgroundClass } from "#/landing/lib/tones.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	tone?: Tone;
}

/**
 * The badge pill that opens most sections ("New platform", "For clients"…):
 * tinted rounded-full chip with an optional pulse dot or icon and a label in
 * the tone color.
 */
export function EyebrowRoot({ tone = "primary", className, ...props }: Props) {
	return (
		<EyebrowToneContext.Provider value={tone}>
			<div
				data-slot="eyebrow"
				className={cn(
					"inline-flex items-center gap-2 rounded-full px-4 py-1.5",
					toneTintBackgroundClass[tone],
					className,
				)}
				{...props}
			/>
		</EyebrowToneContext.Provider>
	);
}
