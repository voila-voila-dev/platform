import { AccordionContent } from "#/accordion/components/accordion-content.tsx";
import { AccordionItem } from "#/accordion/components/accordion-item.tsx";
import { AccordionRoot } from "#/accordion/components/accordion-root.tsx";
import { AccordionTrigger } from "#/accordion/components/accordion-trigger.tsx";

/**
 * The Accordion parts as one namespace.
 */
export const Accordion = {
	Root: AccordionRoot,
	Content: AccordionContent,
	Item: AccordionItem,
	Trigger: AccordionTrigger,
};
