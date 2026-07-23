import {
	MagnifyingGlassIcon,
	SlidersHorizontalIcon,
} from "@phosphor-icons/react";
import { Badge } from "@voila.dev/ui/components/badge";
import { cn } from "@voila.dev/ui/lib/utils";
import type { FilterLabels } from "#/types.ts";

/**
 * The one control a filtered list shows at rest: a search-field-shaped button.
 * It reads as a search box because searching is what people come to a list to
 * do, and it carries the active-filter count so a filtered list never looks
 * like a short one. Tapping it opens the editor.
 */
export function FilterTrigger({
	summary,
	activeCount,
	labels,
	className,
	...props
}: React.ComponentProps<"button"> & {
	/** Current search text, or the placeholder when nothing is searched yet. */
	readonly summary?: string;
	readonly activeCount: number;
	readonly labels: FilterLabels;
}) {
	return (
		<button
			type="button"
			data-slot="filter-trigger"
			aria-label={labels.trigger}
			className={cn(
				"flex h-9 w-full cursor-pointer items-center gap-2 rounded-lg border border-input bg-background px-3 text-left text-sm transition-colors hover:bg-accent focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none dark:bg-input/30",
				className,
			)}
			{...props}
		>
			<MagnifyingGlassIcon className="size-4 shrink-0 text-muted-foreground" />
			<span
				className={cn(
					"truncate",
					summary === undefined && "text-muted-foreground",
				)}
			>
				{summary ?? labels.searchPlaceholder}
			</span>
			<span className="ml-auto flex shrink-0 items-center gap-2">
				{activeCount > 0 && (
					<Badge variant="default" size="sm">
						{activeCount}
					</Badge>
				)}
				<SlidersHorizontalIcon className="size-4 text-muted-foreground" />
			</span>
		</button>
	);
}
