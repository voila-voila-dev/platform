import { cn } from "#/lib/utils.ts";

/**
 * Run a document.execCommand-based inline formatting command against the
 * current text selection, then poke the surrounding contentEditable's `input`
 * handler so the paragraph block re-reads the DOM into the span model. The
 * toolbar buttons prevent mousedown default so the text selection (and focus)
 * survive the click.
 */
export function applyInlineFormat(command: string, value?: string): void {
	document.execCommand("styleWithCSS", false, "false");
	document.execCommand(command, false, value);
	const node = window.getSelection()?.anchorNode;
	const element = node instanceof Element ? node : node?.parentElement;
	element
		?.closest("[contenteditable]")
		?.dispatchEvent(new Event("input", { bubbles: true }));
}

export function keepSelection(event: { preventDefault: () => void }): void {
	event.preventDefault();
}

export const INLINE_MARKS = ["bold", "italic", "underline"] as const;

/**
 * Tap targets reach the 44px floor on touch pointers and stay compact under a
 * mouse. `size-11` overrides the size variant's `size-*` through
 * tailwind-merge, so the two never fight.
 */
export function toolbarButtonClassName(
	coarsePointer: boolean,
	active = false,
): string {
	return cn(
		"shrink-0",
		coarsePointer && "size-11",
		active && "bg-accent text-accent-foreground",
	);
}

/** The `<a>` the caret or selection currently sits in, if any. */
// fallow-ignore-next-line complexity -- a few null guards on the live selection; cognitive complexity is 3.
export function selectedAnchorElement(): HTMLAnchorElement | null {
	const selection = window.getSelection();
	const node = selection?.anchorNode;
	if (!node) {
		return null;
	}
	const element = node instanceof Element ? node : node.parentElement;
	return element?.closest("a") ?? null;
}
