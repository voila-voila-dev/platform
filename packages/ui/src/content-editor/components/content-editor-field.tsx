import { ContentEditor } from "#/content-editor/components/namespace.ts";
import type { ContentEditorRootProps } from "#/content-editor/components/root.tsx";

interface Props extends Omit<ContentEditorRootProps, "children"> {
	/** `false` for a chrome-less field: the floating toolbar and the slash menu remain. */
	toolbar?: boolean;
	/** Keeps the toolbar row visible while a long document scrolls under it. */
	stickyToolbar?: boolean;
	placeholder?: string;
	/** Shows the character and word count under the document. */
	count?: boolean;
	/** Reaches the editable element, for a form's blur and focus. */
	onBlur?: () => void;
	autoFocus?: boolean;
}

/**
 * The parts arranged the usual way: a toolbar, the canvas, the floating
 * toolbar over a selection. Reach for `ContentEditor.*` when you want a
 * different arrangement; this is that composition, with no options you
 * would have to undo.
 */
export function ContentEditorField({
	toolbar = true,
	stickyToolbar = false,
	placeholder,
	count = false,
	onBlur,
	autoFocus,
	...root
}: Props) {
	return (
		<ContentEditor.Root {...root}>
			<ContentEditor.Layout stickyToolbar={stickyToolbar}>
				{toolbar ? <ContentEditor.Toolbar /> : null}
				<ContentEditor.Canvas
					placeholder={placeholder}
					onBlur={onBlur}
					autoFocus={autoFocus}
				/>
				{count ? <ContentEditor.CharacterCount /> : null}
			</ContentEditor.Layout>
			<ContentEditor.FloatingToolbar />
		</ContentEditor.Root>
	);
}
