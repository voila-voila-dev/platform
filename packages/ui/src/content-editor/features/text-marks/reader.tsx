import type {
	ContentFeatureReader,
	ContentLeafDecorator,
} from "#/content-editor/features/reader-definition.tsx";

export interface ContentTextMarks {
	readonly bold?: boolean;
	readonly italic?: boolean;
	readonly underline?: boolean;
	readonly strikethrough?: boolean;
	readonly code?: boolean;
}

const bold: ContentLeafDecorator = {
	key: "bold",
	Render: ({ children }) => <strong>{children}</strong>,
	toHtml: (inner) => `<strong>${inner}</strong>`,
};
const italic: ContentLeafDecorator = {
	key: "italic",
	Render: ({ children }) => <em>{children}</em>,
	toHtml: (inner) => `<em>${inner}</em>`,
};
const underline: ContentLeafDecorator = {
	key: "underline",
	Render: ({ children }) => <u>{children}</u>,
	toHtml: (inner) => `<u>${inner}</u>`,
};
const strikethrough: ContentLeafDecorator = {
	key: "strikethrough",
	Render: ({ children }) => <s>{children}</s>,
	toHtml: (inner) => `<s>${inner}</s>`,
};
const code: ContentLeafDecorator = {
	key: "code",
	Render: ({ children }) => (
		<code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.875em]">
			{children}
		</code>
	),
	toHtml: (inner) => `<code>${inner}</code>`,
};

export type ContentMark = keyof ContentTextMarks;

const decorators: Record<ContentMark, ContentLeafDecorator> = {
	bold,
	italic,
	underline,
	strikethrough,
	code,
};

export const CONTENT_MARKS: ReadonlyArray<ContentMark> = [
	"bold",
	"italic",
	"underline",
	"strikethrough",
	"code",
];

/**
 * Marks nest in `CONTENT_MARKS` order, outermost first:
 * `<strong><em>…</em></strong>`, whatever order `marks` lists them in.
 */
export function createTextMarksReader(
	marks: ReadonlyArray<ContentMark> = CONTENT_MARKS,
) {
	return {
		key: "text-marks",
		leaves: CONTENT_MARKS.filter((mark) => marks.includes(mark)).map(
			(mark) => decorators[mark],
		),
	} satisfies ContentFeatureReader;
}

export const textMarksReader = createTextMarksReader();
