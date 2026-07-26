import { LinkIcon } from "@phosphor-icons/react";
import { useRef } from "react";
import { Button } from "#/button/components/button.tsx";
import { LinkPopover } from "#/email-block-editor/components/link-popover.tsx";
import {
	applyInlineFormat,
	keepSelection,
	selectedAnchorElement,
	toolbarButtonClassName,
} from "#/email-block-editor/lib/inline-format.ts";

interface Props {
	active: boolean;
	coarsePointer: boolean;
}

/** Link editing on the current text selection. Opening on a caret inside an
 * existing link edits that whole link (URL prefilled); the selection is saved
 * while the popover holds focus and restored before the command applies. */
export function SelectionLinkButton({ active, coarsePointer }: Props) {
	const savedRangeRef = useRef<Range | null>(null);

	const restoreSelection = (): boolean => {
		const range = savedRangeRef.current;
		if (!range) {
			return false;
		}
		const selection = window.getSelection();
		selection?.removeAllRanges();
		selection?.addRange(range);
		return true;
	};

	return (
		<LinkPopover
			trigger={
				<Button
					variant="ghost"
					size={coarsePointer ? "icon" : "icon-sm"}
					aria-label="Insert a link"
					aria-pressed={active || undefined}
					className={toolbarButtonClassName(coarsePointer, active)}
					onMouseDown={keepSelection}
				>
					<LinkIcon aria-hidden />
				</Button>
			}
			initialHref={() => selectedAnchorElement()?.getAttribute("href") ?? ""}
			// fallow-ignore-next-line complexity -- selection bookkeeping guards; cognitive complexity is 4.
			onOpen={() => {
				// A caret inside a link edits the whole link, not an empty range.
				const anchor = selectedAnchorElement();
				const selection = window.getSelection();
				if (anchor && selection?.isCollapsed) {
					const range = document.createRange();
					range.selectNodeContents(anchor);
					selection.removeAllRanges();
					selection.addRange(range);
				}
				savedRangeRef.current =
					selection && selection.rangeCount > 0
						? selection.getRangeAt(0).cloneRange()
						: null;
			}}
			onApply={(href) => {
				if (restoreSelection()) {
					applyInlineFormat("createLink", href);
				}
			}}
			onRemove={() => {
				if (restoreSelection()) {
					applyInlineFormat("unlink");
				}
			}}
		/>
	);
}
