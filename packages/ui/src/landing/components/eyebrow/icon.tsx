import { useContext } from "react";
import { EyebrowToneContext } from "#/landing/components/eyebrow/context/eyebrow-context.ts";
import { toneTextClass } from "#/landing/lib/tones.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"span"> {}

export function EyebrowIcon({ className, ...props }: Props) {
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
