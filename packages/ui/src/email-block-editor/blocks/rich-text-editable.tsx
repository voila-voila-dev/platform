import { useLayoutEffect, useRef } from "react";
import {
	editorElementToTextSpans,
	textSpansToEditorHtml,
	textSpansToPlainText,
} from "#/email-block-editor/document/rich-text.ts";
import type { EmailEditorTextSpan } from "#/email-block-editor/document/types.ts";
import { cn } from "#/lib/utils.ts";

interface Props {
	spans: ReadonlyArray<EmailEditorTextSpan>;
	onChange: (spans: ReadonlyArray<EmailEditorTextSpan>) => void;
	ariaLabel: string;
	placeholder: string;
	className?: string;
	style?: React.CSSProperties;
}

/**
 * The in-place rich-text surface shared by every block that holds spans (the
 * paragraph, a list item). Bold, italic, underline and links are applied from
 * the block toolbar, which acts on the live selection — so this component only
 * has to keep the DOM and the span model in sync.
 *
 * The DOM is rewritten only when the document changes from *outside* the
 * editable, which is what keeps the caret from jumping while typing.
 */
export function RichTextEditable({
	spans,
	onChange,
	ariaLabel,
	placeholder,
	className,
	style,
}: Props) {
	const editableRef = useRef<HTMLDivElement>(null);
	const renderedHtmlRef = useRef<string | null>(null);
	const html = textSpansToEditorHtml(spans);

	useLayoutEffect(() => {
		const editable = editableRef.current;
		if (editable && html !== renderedHtmlRef.current) {
			editable.innerHTML = html;
			renderedHtmlRef.current = html;
		}
	}, [html]);

	const handleInput = () => {
		const editable = editableRef.current;
		if (!editable) {
			return;
		}
		const next = editorElementToTextSpans(editable);
		// Remember the normalized serialization: when the parent echoes the
		// change back, the effect sees the same html and leaves the DOM (and
		// the caret) alone.
		renderedHtmlRef.current = textSpansToEditorHtml(next);
		onChange(next);
	};

	const empty = textSpansToPlainText(spans).trim() === "";

	return (
		// biome-ignore lint/a11y/useSemanticElements: rich text needs contentEditable; the div IS the text box.
		// biome-ignore lint/a11y/useFocusableInteractive: contentEditable elements are natively focusable.
		<div
			ref={editableRef}
			role="textbox"
			aria-multiline="true"
			aria-label={ariaLabel}
			contentEditable
			suppressContentEditableWarning
			data-placeholder={placeholder}
			onInput={handleInput}
			className={cn(
				// `min-h-[1lh]` keeps one line of height while the box is empty: a
				// collapsed contentEditable would let the absolutely-positioned
				// placeholder spill over whatever follows the block.
				"relative min-h-[1lh] w-full whitespace-pre-wrap break-words outline-none [&_a]:text-primary [&_a]:underline",
				className,
				// `inset-x-0` matters: without horizontal offsets the pseudo-element
				// takes its static position, which under a centred block starts at the
				// middle of the line and wraps. Spanning the full width lets it inherit
				// the block's own text alignment instead.
				empty &&
					"before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:opacity-40 before:content-[attr(data-placeholder)]",
			)}
			style={style}
		/>
	);
}
