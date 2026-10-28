import { NumberedCard } from "#/components/numbered-cards/card.tsx";
import { NumberedCardDescription } from "#/components/numbered-cards/card-description.tsx";
import { NumberedCardHeader } from "#/components/numbered-cards/card-header.tsx";
import { NumberedCardIcon } from "#/components/numbered-cards/card-icon.tsx";
import { NumberedCardLabel } from "#/components/numbered-cards/card-label.tsx";
import { NumberedCardTitle } from "#/components/numbered-cards/card-title.tsx";
import { NumberedCardsRoot } from "#/components/numbered-cards/root.tsx";

/** Compose: `Root > Card > CardHeader (CardIcon + CardLabel) + CardTitle + CardDescription`. */
export const NumberedCards = {
	Root: NumberedCardsRoot,
	Card: NumberedCard,
	CardHeader: NumberedCardHeader,
	CardIcon: NumberedCardIcon,
	CardLabel: NumberedCardLabel,
	CardTitle: NumberedCardTitle,
	CardDescription: NumberedCardDescription,
};
