import { cn } from "@voila.dev/ui/lib/utils";
import { createContext, useContext } from "react";

import {
	type Tone,
	toneOptions,
	toneSolidBackgroundClass,
	toneTextClass,
	toneTintBackgroundClass,
} from "#/lib/tones.ts";

/**
 * The badge pill that opens most sections ("New platform", "For
 * clients"…): tinted rounded-full chip with an optional pulse dot or icon and a
 * label in the tone color. Reproduces the inline pattern of
 * the source design.
 */

const EyebrowToneContext = createContext<Tone>("primary");

interface EyebrowRootProps extends React.ComponentProps<"div"> {
	tone?: Tone;
}

function Root({ tone = "primary", className, ...props }: EyebrowRootProps) {
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

interface EyebrowDotProps extends React.ComponentProps<"span"> {
	/** The hero variant pulses; the values variant is still. */
	pulse?: boolean;
}

function Dot({ pulse = false, className, ...props }: EyebrowDotProps) {
	const tone = useContext(EyebrowToneContext);

	return (
		<span
			data-slot="eyebrow-dot"
			className={cn(
				"h-2 w-2 rounded-full",
				pulse && "animate-pulse",
				toneSolidBackgroundClass[tone],
				className,
			)}
			{...props}
		/>
	);
}

function Icon({ className, ...props }: React.ComponentProps<"span">) {
	const tone = useContext(EyebrowToneContext);

	return (
		<span
			data-slot="eyebrow-icon"
			className={cn(
				"flex items-center [&_svg]:h-4 [&_svg]:w-4",
				toneTextClass[tone],
				className,
			)}
			{...props}
		/>
	);
}

function Label({ className, ...props }: React.ComponentProps<"span">) {
	const tone = useContext(EyebrowToneContext);

	return (
		<span
			data-slot="eyebrow-label"
			className={cn("text-sm font-medium", toneTextClass[tone], className)}
			{...props}
		/>
	);
}

export const Eyebrow = {
	Root,
	Dot,
	Icon,
	Label,
};

export type { EyebrowDotProps, EyebrowRootProps };
export { type Tone, toneOptions };
