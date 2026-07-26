import { CardAction } from "#/card/components/card-action.tsx";
import { CardContent } from "#/card/components/card-content.tsx";
import { CardDescription } from "#/card/components/card-description.tsx";
import { CardFooter } from "#/card/components/card-footer.tsx";
import { CardHeader } from "#/card/components/card-header.tsx";
import { CardRoot } from "#/card/components/card-root.tsx";
import { CardTitle } from "#/card/components/card-title.tsx";

/**
 * The Card parts as one namespace.
 */
export const Card = {
	Root: CardRoot,
	Action: CardAction,
	Content: CardContent,
	Description: CardDescription,
	Footer: CardFooter,
	Header: CardHeader,
	Title: CardTitle,
};
