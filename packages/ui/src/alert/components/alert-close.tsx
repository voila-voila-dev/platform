import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { XIcon } from "@phosphor-icons/react";

import { AlertAction } from "#/alert/components/alert-action.tsx";
import { buttonVariants } from "#/button/components/button-variants.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"button"> {}

export function AlertClose({ className, render, children, ...props }: Props) {
	const element = useRender({
		defaultTagName: "button",
		props: mergeProps<"button">(
			{
				type: "button",
				"aria-label": "Dismiss",
				className: cn(
					buttonVariants({ variant: "ghost", size: "icon-xs" }),
					"text-muted-foreground",
					className,
				),
				children: children ?? <XIcon />,
			},
			props,
		),
		render,
		state: { slot: "alert-close" },
	});

	return <AlertAction>{element}</AlertAction>;
}
