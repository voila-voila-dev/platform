import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";
import { NumberedCardsToneContext } from "#/components/numbered-cards/context/numbered-cards-context.ts";
import {
	type NumberedCardsVariants,
	numberedCardsVariants,
} from "#/components/numbered-cards/numbered-cards-variants.ts";
import type { Tone } from "#/lib/tones.ts";

interface Props extends React.ComponentProps<"div">, NumberedCardsVariants {
	/**
	 * Which brand role colours this section: the tint, the solid fill and any
	 * connector line move together. Tokens, so a rebrand reaches them.
	 */
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
