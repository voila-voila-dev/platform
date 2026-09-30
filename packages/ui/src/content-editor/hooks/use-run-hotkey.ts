import { isHotkey, RangeApi } from "platejs";
import { useEditorRef } from "platejs/react";
import type { KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import { useContentEditorConfig } from "#/content-editor/context/content-editor-context.tsx";
import type { ContentEditorApi } from "#/content-editor/features/feature-definition.tsx";
import { focusInspectorFor } from "#/content-editor/lib/popover-hosts.ts";

/**
 * slate-react copies the DOM selection into the editor on a throttle, so a
 * key pressed right after Shift+Arrow would see the old caret: ⌘K would find
 * nothing selected and do nothing. `flushSync` also mounts the floating
 * toolbar the new selection brings, so its form is there to open.
 */
function syncSelectionFromDom(editor: ContentEditorApi) {
	const domSelection = window.getSelection();
	if (domSelection === null || domSelection.rangeCount === 0) {
		return;
	}
	const range = editor.api.toSlateRange(domSelection, {
		exactMatch: false,
		suppressThrow: true,
	});
	if (range && !RangeApi.equals(range, editor.selection ?? range)) {
		flushSync(() => editor.tf.select(range));
	}
}

/**
 * Does what pressing a toolbar item does when its `hotkey` is pressed: runs
 * it, or opens its form. Returns whether the key belonged to an item, so the
 * caller keeps it from the browser (⌘K focuses the address bar in some).
 */
export function useRunHotkey(): (event: KeyboardEvent) => boolean {
	const editor = useEditorRef();
	const { registry, capabilities, labels, uploadImage, readOnly, popovers } =
		useContentEditorConfig();
	return (event) => {
		const item = [
			...registry.toolbarItems(capabilities),
			...registry.floatingItems(capabilities),
		].find(
			(candidate) =>
				candidate.hotkey !== undefined && isHotkey(candidate.hotkey, event),
		);
		if (item === undefined) {
			return false;
		}
		syncSelectionFromDom(editor);
		if (readOnly || (item.isDisabled?.(editor) ?? false)) {
			return true;
		}
		if (item.Popover !== undefined) {
			if (!focusInspectorFor(item, editor, popovers)) {
				popovers.open(item.key);
			}
		} else {
			item.run(editor, { labels, uploadImage });
		}
		return true;
	};
}
