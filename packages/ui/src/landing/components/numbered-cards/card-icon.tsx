import { useContext } from "react";
import { NumberedCardsToneContext } from "#/landing/components/numbered-cards/context/numbered-cards-context.ts";
import { toneTextClass, toneTintBackgroundClass } from "#/landing/lib/tones.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"span"> {}

export function NumberedCardIcon({ className, ...props }: Props) {
	const tone = useContext(NumberedCardsToneContext);

	return (
		<span
			data-slot="numbered-cards-card-icon"
			className={cn(
				"flex h-12 w-12 items-center justify-center rounded-xl [&_svg]:h-6 [&_svg]:w-6",
				toneTintBackgroundClass[tone],
				toneTextClass[tone],
				className,
			)}
			{...props}
		/>
	);
}
