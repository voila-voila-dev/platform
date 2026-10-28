import { useEditorRef } from "platejs/react";
import { useRef, useState } from "react";
import { Button } from "#/button/components/button.tsx";
import { useContentEditorLabels } from "#/content-editor/context/content-editor-context.tsx";
import type { ContentEditorApi } from "#/content-editor/features/feature-definition.tsx";
import { removeLink, upsertLink } from "#/content-editor/lib/links.ts";
import { Input } from "#/input/components/input.tsx";

/** The link under the selection, if the caret sits inside one. */
export function linkAtSelection(
	editor: ContentEditorApi,
): { readonly url: string; readonly title?: string } | null {
	if (editor.selection === null) {
		return null;
	}
	const above = editor.api.above({ match: { type: "a" } });
	if (above === undefined) {
		return null;
	}
	const [node] = above as [{ url?: string; title?: string }, unknown];
	return { url: node.url ?? "", title: node.title };
}

interface Props {
	readonly onClose: () => void;
}

/**
 * The link form, opened from a toolbar item. The editor's selection is
 * captured on mount because focusing the URL field takes the DOM selection
 * with it, and the link must land where the caret was, not where it went.
 */
export function ContentLinkPopover({ onClose }: Props) {
	const editor = useEditorRef();
	const labels = useContentEditorLabels();
	const existing = useRef(linkAtSelection(editor));
	const selection = useRef(editor.selection);
	const [url, setUrl] = useState(existing.current?.url ?? "");

	const restore = () => {
		if (selection.current !== null) {
			editor.tf.select(selection.current);
		}
	};

	return (
		<form
			data-slot="content-editor-link-popover"
			className="flex flex-col gap-2"
			onSubmit={(event) => {
				event.preventDefault();
				restore();
				if (existing.current !== null) {
					editor.tf.setNodes({ url: url.trim() } as never, {
						match: { type: "a" },
					});
				} else {
					upsertLink(editor, { url });
				}
				onClose();
			}}
		>
			<Input
				aria-label={labels.chrome.url}
				type="url"
				placeholder={labels.chrome.urlPlaceholder}
				value={url}
				onChange={(event) => setUrl(event.target.value)}
				autoFocus
			/>
			<div className="flex items-center justify-between gap-2">
				<Button type="submit" size="sm" disabled={url.trim() === ""}>
					{labels.chrome.apply}
				</Button>
				{existing.current !== null ? (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => {
							restore();
							removeLink(editor);
							onClose();
						}}
					>
						{labels.items.unlink}
					</Button>
				) : null}
			</div>
		</form>
	);
}
