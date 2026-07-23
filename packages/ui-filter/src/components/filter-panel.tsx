import { Button } from "@voila.dev/ui/components/button";
import { Input } from "@voila.dev/ui/components/input";
import {
	ResponsiveDialog,
	ResponsiveDialogBody,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogFooter,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle,
} from "@voila.dev/ui/components/responsive-dialog";
import { useEffect, useState } from "react";
import { FilterForm } from "#/components/filter-form.tsx";
import { countActiveFilters } from "#/lib/filter-values.ts";
import type { FilterDefinition, FilterLabels, FilterValues } from "#/types.ts";

/**
 * The editor as an overlay: a centered dialog on desktop, a bottom drawer on
 * mobile. Edits are a draft committed on "Apply" — a filtered list refetches,
 * and refetching on every keystroke of a half-typed filter is both slower and
 * harder to reason about than one deliberate commit. Dismissing discards.
 */
export function FilterPanel({
	open,
	onOpenChange,
	definitions,
	values,
	onValuesChange,
	labels,
	locale,
	searchValue,
	onSearchChange,
}: {
	readonly open: boolean;
	readonly onOpenChange: (open: boolean) => void;
	readonly definitions: ReadonlyArray<FilterDefinition>;
	readonly values: FilterValues;
	/** Called once, on apply, with the committed record. */
	readonly onValuesChange: (values: FilterValues) => void;
	readonly labels: FilterLabels;
	readonly locale: string;
	/** Free-text search, kept beside the filters when the list has one. */
	readonly searchValue?: string;
	readonly onSearchChange?: (value: string) => void;
}) {
	const [draft, setDraft] = useState<FilterValues>(values);
	const [draftSearch, setDraftSearch] = useState(searchValue ?? "");

	// Reopening starts from what is applied — including changes made meanwhile
	// by removing a chip outside the panel.
	useEffect(() => {
		if (open) {
			setDraft(values);
			setDraftSearch(searchValue ?? "");
		}
	}, [open, values, searchValue]);

	const apply = () => {
		onValuesChange(draft);
		onSearchChange?.(draftSearch);
		onOpenChange(false);
	};

	const draftCount = countActiveFilters(draft);

	return (
		<ResponsiveDialog open={open} onOpenChange={onOpenChange}>
			{/* No autofocus: the first field is the search box, and focusing it on
			    open throws the phone keyboard over the filters you came to read. */}
			{/* `overflow-hidden` on the shell leaves exactly one scroll container —
			    the body below. The dialog half scrolls itself by default, which
			    would stack a second scrollbar next to it. */}
			<ResponsiveDialogContent
				size="lg"
				className="overflow-hidden"
				closeButtonLabel={labels.close}
				autoFocus={false}
			>
				<ResponsiveDialogHeader>
					<ResponsiveDialogTitle>{labels.title}</ResponsiveDialogTitle>
					{labels.description !== undefined && (
						<ResponsiveDialogDescription>
							{labels.description}
						</ResponsiveDialogDescription>
					)}
				</ResponsiveDialogHeader>

				{/* The scroll container would clip the focus ring of a field sitting
				    against its edge (the search box does). The inset gutter gives the
				    ring its room back without narrowing the fields — the mobile half
				    already has `px-4` for that. */}
				<ResponsiveDialogBody className="no-scrollbar flex max-h-[60vh] min-w-0 flex-col gap-5 overflow-x-hidden overflow-y-auto py-1 md:-mx-1 md:px-1">
					{onSearchChange !== undefined && (
						<Input
							type="search"
							aria-label={labels.search}
							placeholder={labels.searchPlaceholder}
							value={draftSearch}
							onChange={(event) => setDraftSearch(event.target.value)}
						/>
					)}
					<FilterForm
						definitions={definitions}
						values={draft}
						onValuesChange={setDraft}
						labels={labels}
						locale={locale}
					/>
				</ResponsiveDialogBody>

				<ResponsiveDialogFooter>
					<Button
						type="button"
						variant="ghost"
						disabled={draftCount === 0 && draftSearch === ""}
						onClick={() => {
							setDraft({});
							setDraftSearch("");
						}}
					>
						{labels.clearAll}
					</Button>
					<Button type="button" onClick={apply}>
						{labels.apply}
					</Button>
				</ResponsiveDialogFooter>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}
