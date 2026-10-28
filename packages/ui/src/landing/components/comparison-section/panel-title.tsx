import { useContext } from "react";
import {
	ComparisonPanelContext,
	ComparisonToneContext,
} from "#/landing/components/comparison-section/context/comparison-section-context.ts";
import { toneTextClass } from "#/landing/lib/tones.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"p"> {}

export function ComparisonPanelTitle({ className, ...props }: Props) {
	const tone = useContext(ComparisonToneContext);
	const variant = useContext(ComparisonPanelContext);

	return (
		<p
			data-slot="comparison-panel-title"
			className={cn(
				"mb-3 text-sm font-semibold uppercase tracking-wide",
				variant === "without" ? "text-muted-foreground" : toneTextClass[tone],
				className,
			)}
			{...props}
		/>
	);
}
