import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";
import {
	type StatCardFormat,
	StatCardNumber,
} from "#/stat-card/components/stat-card-number.tsx";

interface Props extends useRender.ComponentProps<"div"> {
	/** A number to show instead of children: it springs from the previous value when it changes. */
	value?: number;
	/** How `value` reads: an `Intl.NumberFormat` or a function. Defaults to the target's own decimals. */
	format?: StatCardFormat;
}

export function StatCardValue({
	className,
	render,
	value,
	format,
	children,
	...props
}: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					"px-4 text-2xl font-semibold tracking-tight tabular-nums group-data-[size=sm]/card:px-3",
					className,
				),
				children:
					value === undefined ? (
						children
					) : (
						<StatCardNumber value={value} format={format} />
					),
			},
			props,
		),
		render,
		state: { slot: "stat-card-value" },
	});
}
