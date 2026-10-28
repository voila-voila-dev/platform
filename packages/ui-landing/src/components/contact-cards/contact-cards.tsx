import { ContactCard } from "#/components/contact-cards/card.tsx";
import { ContactCardDescription } from "#/components/contact-cards/card-description.tsx";
import { ContactCardTitle } from "#/components/contact-cards/card-title.tsx";
import { ContactCardsRoot } from "#/components/contact-cards/root.tsx";

/** Compose: `Root > Card > CardTitle + CardDescription`. */
export const ContactCards = {
	Root: ContactCardsRoot,
	Card: ContactCard,
	CardTitle: ContactCardTitle,
	CardDescription: ContactCardDescription,
};
