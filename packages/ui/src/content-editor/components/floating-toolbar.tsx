import { useEditorRef, useEditorSelector } from "platejs/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ContentEditorToolbarItem } from "#/content-editor/components/toolbar-item.tsx";
import { useContentEditorConfig } from "#/content-editor/context/content-editor-context.tsx";
import type { ContentEditorApi } from "#/content-editor/features/feature-definition.tsx";
import { cn } from "#/lib/utils.ts";

/**
 * `useEditorSelector` only follows the editor's `onChange`; a mouse drag or
 * a double-click word select does not always re-render. This ticks on every
 * DOM `selectionchange` so the rect below is recomputed while dragging.
 */
function useSelectionTick(): number {
	const [tick, setTick] = useState(0);
	useEffect(() => {
		const bump = () => setTick((current) => current + 1);
		document.addEventListener("selectionchange", bump);
		return () => document.removeEventListener("selectionchange", bump);
	}, []);
	return tick;
}

/**
 * The rect of the editor's logical selection, not `window.getSelection()`:
 * the two diverge when focus is in the link form, and the toolbar must keep
 * tracking the text the user selected rather than follow focus into the input.
 */
function selectionRect(editor: ContentEditorApi): DOMRect | null {
	if (editor.selection === null || editor.api.isCollapsed()) {
		return null;
	}
	try {
		const range = editor.api.toDOMRange(editor.selection);
		if (range === undefined) {
			return null;
		}
		const rect = range.getBoundingClientRect();
		return rect.width === 0 && rect.height === 0 ? null : rect;
	} catch {
		return null;
	}
}

interface Props {
	className?: string;
}

/**
 * The selection-anchored toolbar: the registry's floating items, shown
 * above a text selection, flipped below when the top has no room. Rendered
 * into `document.body` so an overflow-clipping ancestor cannot cut it off.
 */
export function ContentEditorFloatingToolbar({ className }: Props) {
	const editor = useEditorRef();
	const { registry, capabilities, readOnly } = useContentEditorConfig();
	const tick = useSelectionTick();
	const selectionKey = useEditorSelector(
		(current) => (current.selection ? JSON.stringify(current.selection) : ""),
		[],
	);
	const toolbarRef = useRef<HTMLDivElement | null>(null);
	const [position, setPosition] = useState<{
		top: number;
		left: number;
	} | null>(null);
	const [pinned, setPinned] = useState(false);

	useLayoutEffect(() => {
		const rect = selectionRect(editor);
		if (rect === null) {
			// No usable selection: when a form inside the toolbar holds focus,
			// keep the last position so the form stays usable.
			if (!pinned) {
				setPosition(null);
			}
			return;
		}
		const height = toolbarRef.current?.offsetHeight ?? 36;
		const width = toolbarRef.current?.offsetWidth ?? 220;
		const margin = 8;
		const wantedTop = rect.top + window.scrollY - height - margin;
		const top =
			wantedTop < window.scrollY + margin
				? rect.bottom + window.scrollY + margin
				: wantedTop;
		const centred = rect.left + window.scrollX + rect.width / 2 - width / 2;
		const left = Math.max(
			margin,
			Math.min(
				centred,
				window.scrollX + document.documentElement.clientWidth - width - margin,
			),
		);
		setPosition({ top, left });
	}, [tick, selectionKey, pinned, editor]);

	if (readOnly || position === null) {
		return null;
	}
	const items = registry.floatingItems(capabilities);
	if (items.length === 0) {
		return null;
	}

	return createPortal(
		<div
			ref={toolbarRef}
			data-slot="content-editor-floating-toolbar"
			role="toolbar"
			onMouseDown={(event) => {
				if (!(event.target instanceof HTMLInputElement)) {
					event.preventDefault();
				}
			}}
			onFocusCapture={() => setPinned(true)}
			onBlurCapture={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
					setPinned(false);
				}
			}}
			style={{
				position: "absolute",
				top: position.top,
				left: position.left,
				zIndex: 50,
			}}
			className={cn(
				"flex items-center gap-0.5 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
				className,
			)}
		>
			{items.map((item) => (
				<ContentEditorToolbarItem key={item.key} item={item} size="sm" />
			))}
		</div>,
		document.body,
	);
}
