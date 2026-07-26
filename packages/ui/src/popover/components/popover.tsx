import { PopoverClose } from "#/popover/components/popover-close.tsx";
import { PopoverContent } from "#/popover/components/popover-content.tsx";
import { PopoverDescription } from "#/popover/components/popover-description.tsx";
import { PopoverHeader } from "#/popover/components/popover-header.tsx";
import { PopoverRoot } from "#/popover/components/popover-root.tsx";
import { PopoverTitle } from "#/popover/components/popover-title.tsx";
import { PopoverTrigger } from "#/popover/components/popover-trigger.tsx";

/**
 * The Popover parts as one namespace.
 */
export const Popover = {
	Root: PopoverRoot,
	Close: PopoverClose,
	Content: PopoverContent,
	Description: PopoverDescription,
	Header: PopoverHeader,
	Title: PopoverTitle,
	Trigger: PopoverTrigger,
};
