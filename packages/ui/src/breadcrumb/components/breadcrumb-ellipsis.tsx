import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { DotsThreeIcon } from "@phosphor-icons/react";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"span"> {}

export function BreadcrumbEllipsis({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "span",
		props: mergeProps<"span">(
			{
				className: cn(
					"flex size-5 items-center justify-center [&>svg]:size-4",
					className,
				),
				children: (
					<>
						<DotsThreeIcon />
						<span className="sr-only">More</span>
					</>
				),
			},
			props,
		),
		render,
		state: {
			slot: "breadcrumb-ellipsis",
		},
	});
}
