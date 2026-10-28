import * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"kbd"> {
	separator?: React.ReactNode;
}

export function KbdGroup({ className, separator, children, ...props }: Props) {
	return (
		<kbd
			data-slot="kbd-group"
			className={cn(
				"inline-flex items-center gap-1 text-muted-foreground",
				className,
			)}
			{...props}
		>
			{separator === undefined
				? children
				: React.Children.toArray(children).map((child, index) => (
						<React.Fragment key={index}>
							{index > 0 && (
								<span aria-hidden="true" data-slot="kbd-separator">
									{separator}
								</span>
							)}
							{child}
						</React.Fragment>
					))}
		</kbd>
	);
}
