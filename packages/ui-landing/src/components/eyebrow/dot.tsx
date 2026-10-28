import { cn } from "@voila.dev/ui/utils";
import { useContext } from "react";
import { EyebrowToneContext } from "#/components/eyebrow/context/eyebrow-context.ts";
import { toneSolidBackgroundClass } from "#/lib/tones.ts";

interface Props extends React.ComponentProps<"span"> {
	/** The hero variant pulses; the values variant is still. */
	pulse?: boolean;
}

export function EyebrowDot({ pulse = false, className, ...props }: Props) {
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
