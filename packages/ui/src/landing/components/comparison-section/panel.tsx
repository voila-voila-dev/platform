import { useContext } from "react";
import {
	ComparisonPanelContext,
	type ComparisonPanelVariant,
	ComparisonToneContext,
} from "#/landing/components/comparison-section/context/comparison-section-context.ts";
import { tonePanelClass } from "#/landing/lib/tones.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	/** Which side of the comparison this panel is — the before or the after. */
	variant: ComparisonPanelVariant;
}

export function ComparisonPanel({ variant, className, ...props }: Props) {
	const tone = useContext(ComparisonToneContext);

	return (
		<ComparisonPanelContext.Provider value={variant}>
			<div
				data-slot="comparison-panel"
				className={cn(
					"animate-fade-up rounded-2xl border p-5",
					variant === "without"
						? "border-border bg-muted/50"
						: tonePanelClass[tone],
					className,
				)}
				{...props}
			/>
		</ComparisonPanelContext.Provider>
	);
}
