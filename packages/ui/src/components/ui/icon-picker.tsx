import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import {
	Icon,
	type PhosphorIconName,
	phosphorIconNames,
} from "@voila.dev/ui-icon/components/icon";
import { useMemo, useState } from "react";
import { Button } from "#/components/ui/button.tsx";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxList,
	ComboboxRow,
} from "#/components/ui/combobox.tsx";
import { cn } from "#/lib/utils.ts";

/**
 * Cap on rendered swatches — the full Phosphor set (~1,500) would jank. The
 * grid is not virtualized; matches beyond the cap are summarized by the
 * "+N more" hint and reachable by refining the search.
 */
const RESULT_LIMIT = 120;

const GRID_COLUMNS = 6;

/** Human-friendly label for an icon name: "FirstAidKitIcon" → "First Aid Kit". */
const formatIconName = (name: string): string =>
	name.replace(/Icon$/, "").replace(/([a-z0-9])([A-Z])/g, "$1 $2");

const chunkIntoRows = (
	iconNames: readonly string[],
	columns: number,
): string[][] => {
	const rows: string[][] = [];
	for (let index = 0; index < iconNames.length; index += columns) {
		rows.push(iconNames.slice(index, index + columns) as string[]);
	}
	return rows;
};

export function IconPicker({
	value: controlledValue,
	defaultValue = null,
	onValueChange,
	placeholder = "Select an icon",
	searchPlaceholder = "Search icons…",
	emptyLabel = "No icons found",
	clearLabel = "Clear selection",
	moreLabel,
	name,
	disabled = false,
	closeOnSelect = true,
	className,
}: {
	/** Controlled selection; omit to let the picker manage its own state. */
	value?: PhosphorIconName | (string & {}) | null;
	/** Initial selection for uncontrolled usage. */
	defaultValue?: PhosphorIconName | (string & {}) | null;
	onValueChange?: (name: string | null) => void;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyLabel?: string;
	clearLabel?: string;
	moreLabel?: (count: number) => string;
	/** When set, renders a hidden input so plain form posts include the icon. */
	name?: string;
	disabled?: boolean;
	/** Keep the popover open after a pick, for rapid-compare flows. */
	closeOnSelect?: boolean;
	className?: string;
}) {
	const [query, setQuery] = useState("");

	const matches = useMemo(() => {
		// Spaces are stripped so the human-formatted spelling shown on the
		// trigger ("First Aid Kit") finds the camelCase export it came from.
		const q = query.trim().toLowerCase().replace(/\s+/g, "");
		if (q.length === 0) return phosphorIconNames;
		const prefixMatches: string[] = [];
		const substringMatches: string[] = [];
		for (const iconName of phosphorIconNames) {
			const lower = iconName.toLowerCase();
			if (!lower.includes(q)) continue;
			if (lower.startsWith(q)) prefixMatches.push(iconName);
			else substringMatches.push(iconName);
		}
		return [...prefixMatches, ...substringMatches];
	}, [query]);

	const shown = matches.slice(0, RESULT_LIMIT);
	const hidden = matches.length - shown.length;
	const rows = useMemo(() => chunkIntoRows(shown, GRID_COLUMNS), [shown]);

	return (
		<Combobox<string>
			grid
			filteredItems={rows}
			{...(controlledValue !== undefined && { value: controlledValue })}
			defaultValue={defaultValue}
			onValueChange={(next) => onValueChange?.(next ?? null)}
			inputValue={query}
			onInputValueChange={setQuery}
			onOpenChange={(nextOpen, eventDetails) => {
				if (
					!nextOpen &&
					!closeOnSelect &&
					eventDetails.reason === "item-press"
				) {
					eventDetails.cancel();
					return;
				}
				if (!nextOpen) setQuery("");
			}}
			name={name}
			disabled={disabled}
		>
			<ComboboxPrimitive.Trigger
				data-slot="icon-picker-trigger"
				render={
					<Button
						type="button"
						variant="outline"
						disabled={disabled}
						className={cn("w-full justify-start gap-2", className)}
					/>
				}
			>
				<ComboboxPrimitive.Value>
					{(selected: string | null) => (
						<>
							{selected ? <Icon name={selected} className="size-4" /> : null}
							<span className="truncate">
								{selected ? formatIconName(selected) : placeholder}
							</span>
						</>
					)}
				</ComboboxPrimitive.Value>
			</ComboboxPrimitive.Trigger>
			{/* Fixed width keeps the 6-column grid compact: anchored to a wide
			    (e.g. full-width) trigger, an anchor-width popup would stretch the
			    swatches apart. max-w clamps to the viewport on small screens. */}
			<ComboboxContent className="w-72 min-w-72 max-w-(--available-width)">
				<ComboboxInput
					placeholder={searchPlaceholder}
					showTrigger={false}
					data-slot="icon-picker-search"
				/>
				<ComboboxEmpty>{emptyLabel}</ComboboxEmpty>
				<ComboboxList
					aria-label={placeholder}
					data-slot="icon-picker-grid"
					className="space-y-1"
				>
					{(row: string[], rowIndex: number) => (
						<ComboboxRow
							key={row[0] ?? rowIndex}
							className="grid grid-cols-6 gap-1"
						>
							{row.map((iconName) => (
								<ComboboxPrimitive.Item
									key={iconName}
									value={iconName}
									data-slot="icon-picker-swatch"
									title={formatIconName(iconName)}
									aria-label={formatIconName(iconName)}
									className="flex aspect-square items-center justify-center rounded-md transition-colors duration-100 outline-none select-none data-highlighted:bg-muted data-selected:bg-accent data-selected:ring-1 data-selected:ring-primary"
								>
									<Icon name={iconName} className="size-5" />
								</ComboboxPrimitive.Item>
							))}
						</ComboboxRow>
					)}
				</ComboboxList>
				{hidden > 0 && (
					<p className="pb-1 text-center text-xs text-muted-foreground">
						{moreLabel
							? moreLabel(hidden)
							: `+${hidden} more — refine your search`}
					</p>
				)}
				<ComboboxPrimitive.Clear
					data-slot="icon-picker-clear"
					render={<Button type="button" variant="ghost" size="sm" />}
					className="m-1 mt-0"
				>
					{clearLabel}
				</ComboboxPrimitive.Clear>
			</ComboboxContent>
		</Combobox>
	);
}
