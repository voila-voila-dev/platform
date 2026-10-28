import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"p"> {}

export function FieldDescription({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "p",
		props: mergeProps<"p">(
			{
				className: cn(
					// `[[data-variant=legend]+&]` tightens the gap when the description
					// directly follows a legend-sized FieldLegend.
					"text-left text-sm leading-normal font-normal text-muted-foreground group-data-[orientation=horizontal]/field:text-balance [[data-variant=legend]+&]:-mt-1.5",
					// `nth-last-2` pulls the description toward the control when it sits
					// just above it (i.e. it is the second-to-last child of the Field).
					"last:mt-0 nth-last-2:-mt-1",
					"[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "field-description" },
	});
}
