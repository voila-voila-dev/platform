import type * as React from "react";
import { NumberedCardsToneContext } from "#/landing/components/numbered-cards/context/numbered-cards-context.ts";
import {
	type NumberedCardsVariants,
	numberedCardsVariants,
} from "#/landing/components/numbered-cards/numbered-cards-variants.ts";
import type { Tone } from "#/landing/lib/tones.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div">, NumberedCardsVariants {
	tone?: Tone;
}

/**
 * Grid of numbered step cards ("Step 1/2/3"). Compose: Root (tone, columns) >
 * Card > CardHeader (CardIcon + CardLabel) + CardTitle + CardDescription.
 */
export function NumberedCardsRoot({
	tone = "primary",
	columns,
	className,
	...props
}: Props) {
	return (
		<NumberedCardsToneContext.Provider value={tone}>
			<div
				data-slot="numbered-cards"
				className={cn(numberedCardsVariants({ columns }), className)}
				{...props}
			/>
		</NumberedCardsToneContext.Provider>
	);
}
