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

/** Marks nest in this order, outermost first: `<strong><em>…</em></strong>`. */
export const textMarksReader = {
	key: "text-marks",
	leaves: [bold, italic, underline, strikethrough, code],
} satisfies ContentFeatureReader;
