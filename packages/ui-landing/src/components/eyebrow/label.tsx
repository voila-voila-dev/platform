import { cn } from "@voila.dev/ui/utils";
import { useContext } from "react";
import { EyebrowToneContext } from "#/components/eyebrow/context/eyebrow-context.ts";
import { toneTextClass } from "#/lib/tones.ts";

interface Props extends React.ComponentProps<"span"> {}

export function EyebrowLabel({ className, ...props }: Props) {
	const tone = useContext(EyebrowToneContext);

	return (
		<span
			data-slot="eyebrow-label"
			className={cn("text-sm font-medium", toneTextClass[tone], className)}
			{...props}
		/>
	);
}
