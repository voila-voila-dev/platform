import { TooltipContent } from "#/tooltip/components/tooltip-content.tsx";
import { TooltipProvider } from "#/tooltip/components/tooltip-provider.tsx";
import { TooltipRoot } from "#/tooltip/components/tooltip-root.tsx";
import { TooltipTrigger } from "#/tooltip/components/tooltip-trigger.tsx";

/**
 * The Tooltip parts as one namespace.
 */
export const Tooltip = {
	Root: TooltipRoot,
	Content: TooltipContent,
	Provider: TooltipProvider,
	Trigger: TooltipTrigger,
};
