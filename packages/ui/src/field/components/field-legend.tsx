import type * as React from "react";
import { cva, type VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";

const fieldLegendVariants = cva({
	base: "mb-1.5 font-medium",
	variants: {
		variant: {
			legend: "text-base",
			label: "text-sm",
		},
	},
	defaultVariants: {
		variant: "legend",
	},
});

interface Props
	extends React.ComponentProps<"legend">,
		VariantProps<typeof fieldLegendVariants> {}

export function FieldLegend({
	className,
	variant = "legend",
	...props
}: Props) {
	return (
		<legend
			data-slot="field-legend"
			data-variant={variant}
			className={cn(fieldLegendVariants({ variant }), className)}
			{...props}
		/>
	);
}
