import { useEffect, useState } from "react";
import { Button } from "#/button/components/button.tsx";
import { FilterForm } from "#/filter/components/filter-form.tsx";
import { countActiveFilters } from "#/filter/lib/filter-values.ts";
import type {
	FilterDefinition,
	FilterLabels,
	FilterValues,
} from "#/filter/types.ts";
import { Input } from "#/input/components/input.tsx";
import { ResponsiveDialog } from "#/responsive-dialog/components/responsive-dialog.tsx";

interface Props {
	/** Whether the overlay is open. Controlled; pair it with `onOpenChange`. */
	open: boolean;
	/** Called when the overlay is dismissed or applied. Dismissing discards the draft. */
	onOpenChange: (open: boolean) => void;
	/** The filters to edit, in the order they are rendered. */
	definitions: ReadonlyArray<FilterDefinition>;
	/** The applied record the draft starts from, re-read each time the panel opens. */
	values: FilterValues;
	/** Called once, on apply, with the committed record. */
	onValuesChange: (values: FilterValues) => void;
	/**
	 * Every string the overlay shows, including the apply and clear buttons.
	 * `Filter.Root` supplies it; standalone, pass `defaultFilterLabels`.
	 */
	labels: FilterLabels;
	/** BCP 47 tag used to format the numbers, money and dates in the fields. */
	locale: string;
	/** Free-text search, kept beside the filters when the list has one. */
	searchValue?: string;
	/** Called on every keystroke — search is not part of the apply-on-commit draft. */
	onSearchChange?: (value: string) => void;
}

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
}: Props) {
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
		<ResponsiveDialog.Root open={open} onOpenChange={onOpenChange}>
			{/* No autofocus: the first field is the search box, and focusing it on
			    open throws the phone keyboard over the filters you came to read. */}
			{/* `overflow-hidden` on the shell leaves exactly one scroll container —
			    the body below. The dialog half scrolls itself by default, which
			    would stack a second scrollbar next to it. */}
			<ResponsiveDialog.Content
				size="lg"
				className="overflow-hidden"
				closeButtonLabel={labels.close}
				autoFocus={false}
			>
				<ResponsiveDialog.Header>
					<ResponsiveDialog.Title>{labels.title}</ResponsiveDialog.Title>
					{labels.description !== undefined && (
						<ResponsiveDialog.Description>
							{labels.description}
						</ResponsiveDialog.Description>
					)}
				</ResponsiveDialog.Header>

				{/* The scroll container would clip the focus ring of a field sitting
				    against its edge (the search box does). The inset gutter gives the
				    ring its room back without narrowing the fields — the mobile half
				    already has `px-4` for that. */}
				<ResponsiveDialog.Body className="no-scrollbar flex max-h-[60vh] min-w-0 flex-col gap-5 overflow-x-hidden overflow-y-auto py-1 md:-mx-1 md:px-1">
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
				</ResponsiveDialog.Body>

				<ResponsiveDialog.Footer>
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
				</ResponsiveDialog.Footer>
			</ResponsiveDialog.Content>
		</ResponsiveDialog.Root>
	);
}
