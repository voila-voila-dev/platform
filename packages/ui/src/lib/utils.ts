import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Inline-link affordance shared by the kit's long-form text containers
 * (Alert title/description, Accordion content) so links read the same
 * everywhere.
 */
export const proseLinkClassName =
	"[&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground";
