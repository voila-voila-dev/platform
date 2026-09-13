/**
 * Every string the editor shows, in one place, so a host ships it in its
 * own language. Sections merge one level deep: a host overriding `items`
 * replaces only the keys it names. No other file in this module holds a
 * user-facing literal; `scripts/check-editor-labels.mjs` enforces it.
 */
export interface ContentEditorChromeLabels {
	readonly editor: string;
	readonly placeholder: string;
	readonly slashPlaceholder: string;
	readonly slashEmpty: string;
	readonly insert: string;
	readonly caption: string;
	readonly altText: string;
	readonly url: string;
	readonly urlPlaceholder: string;
	readonly name: string;
	readonly apply: string;
	readonly remove: string;
	readonly cancel: string;
	readonly edit: string;
	readonly pickImage: string;
	readonly dropToUpload: string;
	readonly uploading: string;
	readonly uploadDisabled: string;
	readonly uploadFailed: (reason: string) => string;
	readonly invalidEmbed: string;
	readonly changeIcon: string;
	readonly unknownElement: (type: string) => string;
	readonly characters: (count: number) => string;
	readonly words: (count: number) => string;
}

/** Toolbar, floating toolbar and slash items, by item key. Open for custom features. */
export interface ContentEditorItemLabels {
	readonly [key: string]: string | undefined;
	readonly bold: string;
	readonly italic: string;
	readonly underline: string;
	readonly strikethrough: string;
	readonly code: string;
	readonly paragraph: string;
	readonly heading2: string;
	readonly heading3: string;
	readonly heading4: string;
	readonly bulletedList: string;
	readonly numberedList: string;
	readonly indent: string;
	readonly outdent: string;
	readonly quote: string;
	readonly divider: string;
	readonly callout: string;
	readonly table: string;
	readonly image: string;
	readonly video: string;
	readonly file: string;
	readonly youtube: string;
	readonly xPost: string;
	readonly link: string;
	readonly unlink: string;
	readonly undo: string;
	readonly redo: string;
	readonly addRowAbove: string;
	readonly addRowBelow: string;
	readonly addColumnLeft: string;
	readonly addColumnRight: string;
	readonly deleteRow: string;
	readonly deleteColumn: string;
	readonly deleteTable: string;
	readonly tableMenu: string;
	readonly headerRow: string;
	readonly mergeCells: string;
	readonly splitCell: string;
	readonly cellBackground: string;
	readonly noBackground: string;
	readonly backgroundGray: string;
	readonly backgroundYellow: string;
	readonly backgroundGreen: string;
	readonly backgroundBlue: string;
	readonly backgroundRed: string;
	readonly deleteMenu: string;
}

export interface ContentEditorLabels {
	readonly chrome: ContentEditorChromeLabels;
	readonly items: ContentEditorItemLabels;
}

export interface ContentEditorLabelsInput {
	readonly chrome?: Partial<ContentEditorChromeLabels>;
	readonly items?: Partial<ContentEditorItemLabels>;
}

export const DEFAULT_CONTENT_EDITOR_LABELS: ContentEditorLabels = {
	chrome: {
		editor: "Content editor",
		placeholder: "Start writing, or type / for a block…",
		slashPlaceholder: "Filter blocks…",
		slashEmpty: "No block matches.",
		insert: "Insert",
		caption: "Add a caption…",
		altText: "Alternative text",
		url: "URL",
		urlPlaceholder: "https://",
		name: "Name",
		apply: "Apply",
		remove: "Remove",
		cancel: "Cancel",
		edit: "Edit",
		pickImage: "Click to upload an image",
		dropToUpload: "Drop to upload",
		uploading: "Uploading…",
		uploadDisabled: "Image upload is not available here.",
		uploadFailed: (reason) => `Upload failed: ${reason}`,
		invalidEmbed: "That is not a link this block understands.",
		changeIcon: "Change icon",
		unknownElement: (type) => `Unknown block: ${type}`,
		characters: (count) => `${count} characters`,
		words: (count) => `${count} words`,
	},
	items: {
		bold: "Bold",
		italic: "Italic",
		underline: "Underline",
		strikethrough: "Strikethrough",
		code: "Code",
		paragraph: "Text",
		heading2: "Heading 2",
		heading3: "Heading 3",
		heading4: "Heading 4",
		bulletedList: "Bulleted list",
		numberedList: "Numbered list",
		indent: "Indent",
		outdent: "Outdent",
		quote: "Quote",
		divider: "Divider",
		callout: "Callout",
		table: "Table",
		image: "Image",
		video: "Video",
		file: "File",
		youtube: "YouTube video",
		xPost: "X post",
		link: "Link",
		unlink: "Remove link",
		undo: "Undo",
		redo: "Redo",
		addRowAbove: "Add row above",
		addRowBelow: "Add row below",
		addColumnLeft: "Add column left",
		addColumnRight: "Add column right",
		deleteRow: "Delete row",
		deleteColumn: "Delete column",
		deleteTable: "Delete table",
		tableMenu: "Table options",
		headerRow: "Header row",
		mergeCells: "Merge cells",
		splitCell: "Split cell",
		cellBackground: "Cell background",
		noBackground: "No background",
		backgroundGray: "Gray fill",
		backgroundYellow: "Yellow fill",
		backgroundGreen: "Green fill",
		backgroundBlue: "Blue fill",
		backgroundRed: "Red fill",
		deleteMenu: "Delete",
	},
};

export function mergeContentEditorLabels(
	input: ContentEditorLabelsInput | undefined,
): ContentEditorLabels {
	if (input === undefined) {
		return DEFAULT_CONTENT_EDITOR_LABELS;
	}
	return {
		chrome: { ...DEFAULT_CONTENT_EDITOR_LABELS.chrome, ...input.chrome },
		items: { ...DEFAULT_CONTENT_EDITOR_LABELS.items, ...input.items },
	};
}
