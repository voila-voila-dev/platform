import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { DotsThreeIcon } from "@phosphor-icons/react";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"span"> {}

export function PaginationEllipsis({
	className,
	children,
	render,
	...props
}: Props) {
	return useRender({
		defaultTagName: "span",
		props: mergeProps<"span">(
			{
				// Decorative gap indicator: `aria-hidden` hides it from the a11y tree,
				// so it carries no sr-only text (the old one was unreachable inside the
				// hidden subtree). The surrounding page links convey the skipped range.
				"aria-hidden": true,
				className: cn(
					"flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
					className,
				),
				children: children ?? <DotsThreeIcon />,
			},
			props,
		),
		render,
		state: { slot: "pagination-ellipsis" },
	});
}
