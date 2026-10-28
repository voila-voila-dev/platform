import {
	CheckCircleIcon,
	MagnifyingGlassIcon,
	PlusIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "#/button/components/button.tsx";
import { Input } from "#/input/components/input.tsx";
import { cn } from "#/lib/utils.ts";
import { ResponsiveSheet } from "#/responsive-sheet/components/responsive-sheet.tsx";

export interface ChipPickerOption {
	readonly id: string;
	readonly label: string;
}

/** Every user-facing string, so the component stays i18n-agnostic. */
export interface ChipPickerLabels {
	/** The trigger under the read-only chips (e.g. "Select"). */
	readonly select: string;
	/** The sheet's closing button (e.g. "Done"). */
	readonly done: string;
	/** Shown when the search matches nothing. */
	readonly noResult: string;
	/**
	 * Selection counter next to the title when no `maxSelected` is set
	 * (with a cap the counter is always "n / max").
	 */
	readonly selectionCount: (count: number) => string;
}

/** Read-only pill for a current selection; editing happens in the sheet. */
function SelectedChip({ label }: { label: string }) {
	return (
		<span className="inline-flex items-center rounded-full border border-primary bg-primary px-3 py-1.5 font-medium text-primary-foreground text-sm">
			{label}
		</span>
	);
}

/** One full-width row of the opened list: label left, selection check right. */
function OptionRow({
	label,
	selected,
	disabled,
	onToggle,
}: {
	label: string;
	selected: boolean;
	disabled: boolean;
	onToggle: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onToggle}
			disabled={disabled}
			aria-pressed={selected}
			className={cn(
				"flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left font-medium text-sm transition-colors hover:bg-muted disabled:opacity-40",
				selected && "bg-primary/5 text-primary",
			)}
		>
			{label}
			<CheckCircleIcon
				weight={selected ? "fill" : "regular"}
				className={cn(
					"size-5 shrink-0",
					selected ? "text-primary" : "text-muted-foreground/30",
				)}
			/>
		</button>
	);
}

function PickerSearch({
	value,
	placeholder,
	onChange,
}: {
	value: string;
	placeholder: string;
	onChange: (next: string) => void;
}) {
	return (
		<div className="relative">
			<MagnifyingGlassIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
			<Input
				type="search"
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
				className="pl-9"
			/>
		</div>
	);
}

function ChipPickerSheet({
	open,
	onOpenChange,
	title,
	searchPlaceholder,
	labels,
	options,
	selected,
	onToggle,
	maxSelected,
	sortLocale,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	searchPlaceholder: string;
	labels: ChipPickerLabels;
	options: ReadonlyArray<ChipPickerOption>;
	selected: ReadonlySet<string>;
	onToggle: (id: string) => void;
	maxSelected?: number;
	sortLocale?: string;
}) {
	const [query, setQuery] = useState("");
	const normalized = query.trim().toLowerCase();
	const sorted = [...options].sort((a, b) =>
		a.label.localeCompare(b.label, sortLocale),
	);
	const visible = sorted.filter((option) =>
		option.label.toLowerCase().includes(normalized),
	);
	const isFull = maxSelected !== undefined && selected.size >= maxSelected;

	return (
		<ResponsiveSheet.Root open={open} onOpenChange={onOpenChange}>
			<ResponsiveSheet.Content>
				<ResponsiveSheet.Header>
					{/* On desktop the sheet's close button sits top-right; keep the
					    counter clear of it. */}
					<div className="flex items-center justify-between gap-3 sm:pr-10">
						<ResponsiveSheet.Title>{title}</ResponsiveSheet.Title>
						<span className="text-muted-foreground text-xs">
							{maxSelected !== undefined
								? `${selected.size} / ${maxSelected}`
								: labels.selectionCount(selected.size)}
						</span>
					</div>
				</ResponsiveSheet.Header>
				{/* Search stays pinned under the header; only the list below scrolls. */}
				<div className="px-4">
					<PickerSearch
						value={query}
						placeholder={searchPlaceholder}
						onChange={setQuery}
					/>
				</div>
				{/* The list fills the height between search and footer, so the sheet
				    shows as many options as fit rather than a fixed short window. */}
				<ResponsiveSheet.Body className="gap-1">
					{visible.map((option) => {
						const isSelected = selected.has(option.id);
						return (
							<OptionRow
								key={option.id}
								label={option.label}
								selected={isSelected}
								disabled={!isSelected && isFull}
								onToggle={() => onToggle(option.id)}
							/>
						);
					})}
					{visible.length === 0 && (
						<p className="text-muted-foreground text-xs">{labels.noResult}</p>
					)}
				</ResponsiveSheet.Body>
				{/* Footer keeps the done action anchored to the bottom of the sheet. */}
				<ResponsiveSheet.Footer>
					<Button type="button" size="lg" onClick={() => onOpenChange(false)}>
						{labels.done}
					</Button>
				</ResponsiveSheet.Footer>
			</ResponsiveSheet.Content>
		</ResponsiveSheet.Root>
	);
}

/**
 * A catalogue multi-select rendered as the selected chips plus a dashed "add"
 * trigger opening the full list in a responsive sheet — one option per row,
 * sorted alphabetically, searchable, optionally capped at `maxSelected`. The
 * collapsed state never shows unselected suggestions, so the host screen stays
 * short. All copy comes in through `labels`, keeping the component
 * i18n-agnostic.
 */
export function ChipPicker({
	title,
	searchPlaceholder,
	labels,
	options,
	selected,
	onToggle,
	maxSelected,
	sortLocale,
	onSheetClosed,
}: {
	title: string;
	searchPlaceholder: string;
	labels: ChipPickerLabels;
	options: ReadonlyArray<ChipPickerOption>;
	selected: ReadonlySet<string>;
	onToggle: (id: string) => void;
	maxSelected?: number;
	sortLocale?: string;
	/**
	 * Fired when the sheet closes — the moment to persist the selection, since
	 * the sheet is the single place it changes.
	 */
	onSheetClosed?: () => void;
}) {
	const [open, setOpen] = useState(false);
	const handleOpenChange = (next: boolean): void => {
		setOpen(next);
		if (!next) {
			onSheetClosed?.();
		}
	};
	const labelOf = (id: string): string =>
		options.find((option) => option.id === id)?.label ?? id;

	return (
		<div className="flex flex-wrap gap-2">
			{[...selected].map((id) => (
				<SelectedChip key={id} label={labelOf(id)} />
			))}
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="inline-flex items-center gap-1 rounded-full border border-dashed px-3 py-1.5 font-medium text-muted-foreground text-sm transition-colors hover:bg-muted"
			>
				<PlusIcon className="size-3.5" />
				{labels.select}
			</button>
			<ChipPickerSheet
				open={open}
				onOpenChange={handleOpenChange}
				title={title}
				searchPlaceholder={searchPlaceholder}
				labels={labels}
				options={options}
				selected={selected}
				onToggle={onToggle}
				maxSelected={maxSelected}
				sortLocale={sortLocale}
			/>
		</div>
	);
}
