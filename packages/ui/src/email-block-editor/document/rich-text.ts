import type { EmailEditorTextSpan } from "#/email-block-editor/document/types.ts";

/**
 * Serialization between the typed span model and the contentEditable DOM the
 * paragraph block edits in place. The HTML vocabulary is intentionally tiny —
 * b/i/u/a plus <br> for line breaks — so both directions stay trivial to
 * reason about and the domain renderer can mirror it safely server-side.
 */

const escapeHtml = (value: string): string =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");

/** Render spans as the minimal editing HTML for the contentEditable surface. */
export const textSpansToEditorHtml = (
	spans: ReadonlyArray<EmailEditorTextSpan>,
): string =>
	spans
		.map((span) => {
			let html = escapeHtml(span.text).replaceAll("\n", "<br>");
			if (span.bold) {
				html = `<b>${html}</b>`;
			}
			if (span.italic) {
				html = `<i>${html}</i>`;
			}
			if (span.underline) {
				html = `<u>${html}</u>`;
			}
			if (span.href !== undefined) {
				html = `<a href="${escapeHtml(span.href)}">${html}</a>`;
			}
			return html;
		})
		.join("");

interface InlineMarks {
	readonly bold?: boolean;
	readonly italic?: boolean;
	readonly underline?: boolean;
	readonly href?: string;
}

const isMarked = (span: EmailEditorTextSpan, marks: InlineMarks): boolean =>
	Boolean(span.bold) === Boolean(marks.bold) &&
	Boolean(span.italic) === Boolean(marks.italic) &&
	Boolean(span.underline) === Boolean(marks.underline) &&
	span.href === marks.href;

// Tag-based marks are what execCommand produces with styleWithCSS off; the
// style-based fallbacks cover pasted content and browsers that emit spans.
const rendersBold = (tag: string, style: CSSStyleDeclaration): boolean =>
	tag === "b" ||
	tag === "strong" ||
	style.fontWeight === "bold" ||
	Number(style.fontWeight) >= 600;

const rendersItalic = (tag: string, style: CSSStyleDeclaration): boolean =>
	tag === "i" || tag === "em" || style.fontStyle === "italic";

const rendersUnderline = (tag: string, style: CSSStyleDeclaration): boolean =>
	tag === "u" || style.textDecoration.includes("underline");

const elementMarks = (
	element: HTMLElement,
	marks: InlineMarks,
): InlineMarks => {
	const tag = element.tagName.toLowerCase();
	const style = element.style;
	const href = tag === "a" ? element.getAttribute("href") : null;
	return {
		...marks,
		...(rendersBold(tag, style) && { bold: true }),
		...(rendersItalic(tag, style) && { italic: true }),
		...(rendersUnderline(tag, style) && { underline: true }),
		...(href !== null && { href }),
	};
};

const collectElementSpans = (
	element: HTMLElement,
	marks: InlineMarks,
	out: Array<EmailEditorTextSpan>,
): void => {
	const tag = element.tagName.toLowerCase();
	if (tag === "br") {
		out.push({ text: "\n", ...marks });
		return;
	}
	// contentEditable wraps new lines in block elements (div/p); each one after
	// the first starts on a new line.
	if ((tag === "div" || tag === "p") && out.length > 0) {
		out.push({ text: "\n", ...marks });
	}
	const childMarks = elementMarks(element, marks);
	for (const child of element.childNodes) {
		collectSpans(child, childMarks, out);
	}
};

const collectSpans = (
	node: Node,
	marks: InlineMarks,
	out: Array<EmailEditorTextSpan>,
): void => {
	if (node.nodeType === Node.TEXT_NODE) {
		const text = node.textContent ?? "";
		if (text !== "") {
			out.push({ text, ...marks });
		}
		return;
	}
	if (node.nodeType === Node.ELEMENT_NODE) {
		collectElementSpans(node as HTMLElement, marks, out);
	}
};

/** Merge adjacent spans carrying identical marks and drop empty runs. */
const normalizeSpans = (
	spans: ReadonlyArray<EmailEditorTextSpan>,
): ReadonlyArray<EmailEditorTextSpan> => {
	const merged: Array<EmailEditorTextSpan> = [];
	for (const span of spans) {
		if (span.text === "") {
			continue;
		}
		const previous = merged[merged.length - 1];
		if (previous && isMarked(previous, span)) {
			merged[merged.length - 1] = {
				...previous,
				text: previous.text + span.text,
			};
		} else {
			merged.push(span);
		}
	}
	// A single trailing newline is contentEditable noise (trailing <br>).
	const last = merged[merged.length - 1];
	if (last?.text.endsWith("\n")) {
		const trimmed = last.text.slice(0, -1);
		if (trimmed === "") {
			merged.pop();
		} else {
			merged[merged.length - 1] = { ...last, text: trimmed };
		}
	}
	return merged;
};

/** Read the contentEditable DOM back into the typed span model. */
export const editorElementToTextSpans = (
	root: HTMLElement,
): ReadonlyArray<EmailEditorTextSpan> => {
	const spans: Array<EmailEditorTextSpan> = [];
	for (const child of root.childNodes) {
		collectSpans(child, {}, spans);
	}
	return normalizeSpans(spans);
};

/** The plain-text projection of the spans (line breaks preserved). */
export const textSpansToPlainText = (
	spans: ReadonlyArray<EmailEditorTextSpan>,
): string => spans.map((span) => span.text).join("");
