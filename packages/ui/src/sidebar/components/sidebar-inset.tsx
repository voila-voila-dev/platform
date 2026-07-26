import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"main"> {}

export function SidebarInset({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "main",
		props: mergeProps<"main">(
			{
				className: cn(
					"relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "sidebar-inset" },
	});
}
