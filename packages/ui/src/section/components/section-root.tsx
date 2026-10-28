import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"section"> {}

/**
 * Vertical rhythm wrapper for an in-page section - heading row + content with
 * consistent spacing, the `PageHeader` anatomy one level down. Renders a
 * `section` by default - pass `render` for a plain `div` when the landmark
 * is unwanted.
 */
export function SectionRoot({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "section",
		props: mergeProps<"section">(
			{
				className: cn("flex flex-col gap-4", className),
			},
			props,
		),
		render,
		state: {
			slot: "section",
		},
	});
}
