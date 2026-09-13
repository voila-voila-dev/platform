import type { ReactNode } from "react";
import { cn } from "#/lib/utils.ts";

interface Props {
	className?: string;
	children: ReactNode;
}

/** The non-editable box every media and embed element draws itself in. */
export function VoidFrame({ className, children }: Props) {
	return (
		<figure
			contentEditable={false}
			className={cn("flex flex-col gap-1 py-1 select-none", className)}
		>
			{children}
		</figure>
	);
}

interface EmptyProps {
	className?: string;
	children: ReactNode;
}

/** The dashed placeholder a void element shows before it has a source. */
export function VoidEmpty({ className, children }: EmptyProps) {
	return (
		<div
			className={cn(
				"flex min-h-24 w-full items-center justify-center gap-2 rounded-xl border border-border border-dashed bg-muted/40 px-4 py-6 text-muted-foreground text-sm",
				className,
			)}
		>
			{children}
		</div>
	);
}
