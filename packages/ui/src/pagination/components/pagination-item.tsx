import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

interface Props extends useRender.ComponentProps<"li"> {}

export function PaginationItem({ render, ...props }: Props) {
	return useRender({
		defaultTagName: "li",
		props: mergeProps<"li">({}, props),
		render,
		state: { slot: "pagination-item" },
	});
}
