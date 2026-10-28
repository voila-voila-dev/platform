import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"nav"> {}

export function PaginationRoot({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "nav",
		props: mergeProps<"nav">(
			{
				// Sentence case to match the kit's other nav labels; overridable
				// (e.g. a French `aria-label`) since the consumer's props are merged
				// second.
				"aria-label": "Pagination",
				className: cn("mx-auto flex w-full justify-center", className),
			},
			props,
		),
		render,
		state: { slot: "pagination" },
	});
}
