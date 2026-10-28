import * as React from "react";

/**
 * Ref for the element the combobox popup anchors to — pass it to the chips
 * container and forward the same ref to `Combobox.Content`'s `anchor`.
 */
export function useComboboxAnchor() {
	return React.useRef<HTMLDivElement | null>(null);
}
