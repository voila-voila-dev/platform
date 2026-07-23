import { cn } from "@voila.dev/ui/lib/utils";

/**
 * Horizontal row of value/label stats separated by hairline dividers, the kind
 * that usually closes a hero.
 */

interface StatsRowRootProps extends React.ComponentProps<"div"> {
	/** Adds the top hairline + spacing used when the row closes a hero. */
	bordered?: boolean;
}

function Root({ bordered = true, className, ...props }: StatsRowRootProps) {
	return (
		<div
			data-slot="stats-row"
			className={cn(
				"flex items-center gap-6 sm:gap-8",
				bordered && "mt-10 border-t border-border/50 pt-8",
				className,
			)}
			{...props}
		/>
	);
}

function Item({ className, ...props }: React.ComponentProps<"div">) {
	return <div data-slot="stats-row-item" className={className} {...props} />;
}

function Value({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="stats-row-value"
			className={cn("text-3xl font-bold text-foreground", className)}
			{...props}
		/>
	);
}

function Label({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="stats-row-label"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

function Divider({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="stats-row-divider"
			className={cn("h-12 w-px bg-border", className)}
			{...props}
		/>
	);
}

export const StatsRow = {
	Root,
	Item,
	Value,
	Label,
	Divider,
};

export type { StatsRowRootProps };
