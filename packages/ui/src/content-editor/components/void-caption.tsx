import { useEditorRef } from "platejs/react";
import { useState } from "react";
import { useContentEditorLabels } from "#/content-editor/context/content-editor-context.tsx";
import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";

interface Props {
	element: ContentNodeLike;
	caption: string | undefined;
}

/**
 * The caption under a void element, edited in place. A button while it
 * reads so the focusable target stays inside the editor; an input while
 * it is being typed, committed on blur or Enter, dropped on Escape.
 */
export function VoidCaption({ element, caption }: Props) {
	const editor = useEditorRef();
	const labels = useContentEditorLabels();
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(caption ?? "");

	const commit = (value: string) => {
		const path = editor.api.findPath(element as never);
		if (path === undefined) {
			return;
		}
		const next = value.trim() === "" ? undefined : value;
		editor.tf.setNodes({ caption: next } as never, { at: path });
	};

	if (!editing) {
		return (
			<button
				type="button"
				data-slot="content-editor-caption"
				onClick={() => {
					setDraft(caption ?? "");
					setEditing(true);
				}}
				className="text-left text-muted-foreground text-xs italic hover:opacity-80"
			>
				{caption ?? labels.chrome.caption}
			</button>
		);
	}
	return (
		<input
			data-slot="content-editor-caption"
			value={draft}
			onChange={(event) => setDraft(event.target.value)}
			onBlur={() => {
				commit(draft);
				setEditing(false);
			}}
			onKeyDown={(event) => {
				if (event.key === "Enter") {
					event.preventDefault();
					commit(draft);
					setEditing(false);
				} else if (event.key === "Escape") {
					event.preventDefault();
					setEditing(false);
				}
			}}
			placeholder={labels.chrome.caption}
			aria-label={labels.chrome.caption}
			className="w-full bg-transparent text-muted-foreground text-xs italic outline-none"
			// biome-ignore lint/a11y/noAutofocus: the field replaces the caption the user just clicked
			autoFocus
		/>
	);
}
