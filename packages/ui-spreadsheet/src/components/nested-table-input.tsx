import { CaretDownIcon } from "@phosphor-icons/react";
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@voila.dev/ui/components/popover";
import { cn } from "@voila.dev/ui/lib/utils";
import type * as React from "react";

type NestedTableInputProps = {
	/**
	 * What the closed cell reads, e.g. "2 paliers" or an em-dash when empty.
	 * The cell is a summary; the detail lives in the popover.
	 */
	summary: string;
	/** Accessible name for the trigger (the summary alone rarely identifies it). */
	ariaLabel: string;
	/** Heading of the popover. */
	title: string;
	/** Optional sentence under the title explaining what the rows mean. */
	description?: string;
	/** The nested table (or any editor) shown once open. */
	children: React.ReactNode;
	/** Tints the cell and raises its destructive ring, like any invalid control. */
	invalid?: boolean;
	/** Width of the popover; the nested table sets its own column widths. */
	contentClassName?: string;
	className?: string;
} & Omit<React.ComponentProps<"button">, "children" | "title">;

/**
 * A cell whose value is a whole sub-table rather than a scalar: it renders a
 * flush summary button and opens a popover holding the nested editor. Use it
 * for row-owned collections (price tiers, discounts) that deserve a grid column
 * but cannot fit one — the summary keeps the row scannable, and the popover
 * gives the collection its own table without leaving the row.
 *
 * The nested content is passed as children, so this stays agnostic about what
 * it hosts and is reusable for any per-row collection.
 */
function NestedTableInput({
	summary,
	ariaLabel,
	title,
	description,
	children,
	invalid,
	contentClassName,
	className,
	...props
}: NestedTableInputProps) {
	return (
		<Popover>
			<PopoverTrigger
				data-slot="nested-table-input"
				aria-label={ariaLabel}
				aria-invalid={invalid}
				className={cn(
					"flex h-9 w-full items-center justify-between gap-1 bg-transparent px-2.5 text-left text-sm outline-none",
					"text-foreground data-[empty=true]:text-muted-foreground",
					className,
				)}
				data-empty={summary.trim().length === 0}
				{...props}
			>
				<span className="truncate">{summary}</span>
				<CaretDownIcon className="size-3.5 shrink-0 text-muted-foreground" />
			</PopoverTrigger>
			<PopoverContent className={cn("w-96", contentClassName)} align="start">
				<PopoverHeader>
					<PopoverTitle>{title}</PopoverTitle>
					{description === undefined ? null : (
						<PopoverDescription>{description}</PopoverDescription>
					)}
				</PopoverHeader>
				{children}
			</PopoverContent>
		</Popover>
	);
}

export { NestedTableInput, type NestedTableInputProps };
