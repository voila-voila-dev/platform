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
	readonly insertVariable: string;
	readonly variablePlaceholder: string;
	readonly variablesEmpty: string;
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
	readonly replace: string;
	readonly pickImage: string;
	readonly imageEmpty: string;
	readonly dropToUpload: string;
	readonly uploading: string;
	readonly uploadDisabled: string;
	readonly uploadFailed: (reason: string) => string;
	readonly invalidEmbed: string;
	readonly changeIcon: string;
	readonly unknownElement: (type: string) => string;
	readonly characters: (count: number) => string;
	readonly words: (count: number) => string;
	readonly inspector: string;
	readonly inspectorEmpty: string;
	readonly currency: string;
	readonly addItem: string;
	readonly removeItem: (position: number) => string;
	readonly columnsColumn: (position: number) => string;
	readonly columnsEmpty: string;
	readonly columnsAdd: string;
	readonly columnsRemove: (position: number) => string;
	readonly columnsMoveBefore: (position: number) => string;
	readonly columnsMoveAfter: (position: number) => string;
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
	readonly variable: string;
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
	readonly columns: string;
	readonly heading1: string;
	readonly badgeList: string;
	readonly highlight: string;
	readonly finePrint: string;
	readonly button: string;
	readonly stat: string;
	readonly article: string;
	readonly product: string;
	readonly offer: string;
	readonly rating: string;
	readonly alignColumnLeft: string;
	readonly alignColumnRight: string;
}

/**
 * The inspector's field labels, descriptions, placeholders and option
 * labels, by the key a field descriptor names. Open for custom features.
 */
export interface ContentEditorFieldLabels {
	readonly [key: string]: string | undefined;
	readonly url: string;
	readonly image: string;
	readonly file: string;
	readonly alt: string;
	readonly altDescription: string;
	readonly caption: string;
	readonly align: string;
	readonly alignLeft: string;
	readonly alignCenter: string;
	readonly alignRight: string;
	readonly buttonLabel: string;
	readonly buttonPlaceholder: string;
	readonly buttonLink: string;
	readonly buttonStyle: string;
	readonly buttonPrimary: string;
	readonly buttonSecondary: string;
	readonly statValue: string;
	readonly statValuePlaceholder: string;
	readonly statLabel: string;
	readonly statLabelPlaceholder: string;
	readonly statDescription: string;
	readonly imageLink: string;
	readonly imageLinkDescription: string;
	readonly imageSize: string;
	readonly imageSizeFull: string;
	readonly imageSizeContained: string;
	readonly imageOverlay: string;
	readonly imageOverlayNone: string;
	readonly imageOverlayPlay: string;
	readonly imageOverlayPlayDescription: string;
	readonly articleTitle: string;
	readonly articleTitlePlaceholder: string;
	readonly articleDescription: string;
	readonly articleDescriptionPlaceholder: string;
	readonly articleImage: string;
	readonly articleAuthor: string;
	readonly articlePublishDate: string;
	readonly articlePublishDatePlaceholder: string;
	readonly articlePublishDateDescription: string;
	readonly articleHref: string;
	readonly articleHrefDescription: string;
	readonly productName: string;
	readonly productNamePlaceholder: string;
	readonly productDescription: string;
	readonly productDescriptionPlaceholder: string;
	readonly productImage: string;
	readonly productPrice: string;
	readonly productCompareAtPrice: string;
	readonly productCompareAtPriceDescription: string;
	readonly productHref: string;
	readonly productButtonLabel: string;
	readonly productButtonLabelPlaceholder: string;
	readonly productButtonLabelDescription: string;
	readonly offerEyebrow: string;
	readonly offerEyebrowPlaceholder: string;
	readonly offerName: string;
	readonly offerNamePlaceholder: string;
	readonly offerDescription: string;
	readonly offerImage: string;
	readonly offerImageDescription: string;
	readonly offerPrice: string;
	readonly offerPeriod: string;
	readonly offerPeriodPlaceholder: string;
	readonly offerPeriodDescription: string;
	readonly offerFeature: string;
	readonly offerButtonLabel: string;
	readonly offerButtonLabelPlaceholder: string;
	readonly offerButtonLabelDescription: string;
	readonly offerButtonHref: string;
	readonly offerHighlighted: string;
	readonly offerHighlightedDescription: string;
	readonly ratingQuestionPlaceholder: string;
	readonly ratingStyle: string;
	readonly ratingStyleFilled: string;
	readonly ratingStyleOutline: string;
	readonly ratingLowLabel: string;
	readonly ratingLowLabelPlaceholder: string;
	readonly ratingHighLabel: string;
	readonly ratingHighLabelPlaceholder: string;
	readonly ratingHref: string;
	readonly ratingHrefDescription: string;
	readonly tableHeaderRow: string;
	readonly tableColumn: string;
	readonly tableAlignLeft: string;
	readonly tableAlignRight: string;
}

export interface ContentEditorLabels {
	readonly chrome: ContentEditorChromeLabels;
	readonly items: ContentEditorItemLabels;
	readonly fields: ContentEditorFieldLabels;
}

export interface ContentEditorLabelsInput {
	readonly chrome?: Partial<ContentEditorChromeLabels>;
	readonly items?: Partial<ContentEditorItemLabels>;
	readonly fields?: Partial<ContentEditorFieldLabels>;
}

export const DEFAULT_CONTENT_EDITOR_LABELS: ContentEditorLabels = {
	chrome: {
		editor: "Content editor",
		placeholder: "Start writing, or type / for a block…",
		slashPlaceholder: "Filter blocks…",
		slashEmpty: "No block matches.",
		insertVariable: "Insert a variable",
		variablePlaceholder: "Find a variable…",
		variablesEmpty: "No variable matches.",
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
		replace: "Replace",
		pickImage: "Click to upload an image",
		imageEmpty: "No image yet. Pick one in the settings.",
		dropToUpload: "Drop to upload",
		uploading: "Uploading…",
		uploadDisabled: "Image upload is not available here.",
		uploadFailed: (reason) => `Upload failed: ${reason}`,
		invalidEmbed: "That is not a link this block understands.",
		changeIcon: "Change icon",
		unknownElement: (type) => `Unknown block: ${type}`,
		characters: (count) => `${count} characters`,
		words: (count) => `${count} words`,
		inspector: "Settings",
		inspectorEmpty: "Select a block to see its settings.",
		currency: "Currency",
		addItem: "Add",
		removeItem: (position) => `Remove item ${position}`,
		columnsColumn: (position) => `Column ${position}`,
		columnsEmpty: "Empty",
		columnsAdd: "Add a column",
		columnsRemove: (position) => `Remove column ${position}`,
		columnsMoveBefore: (position) => `Move column ${position} left`,
		columnsMoveAfter: (position) => `Move column ${position} right`,
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
		variable: "Variable",
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
		columns: "Columns",
		heading1: "Heading 1",
		badgeList: "Badge list",
		highlight: "Highlight",
		finePrint: "Fine print",
		button: "Button",
		stat: "Key figure",
		article: "Article",
		product: "Product",
		offer: "Offer",
		rating: "Rating",
		alignColumnLeft: "Align column left",
		alignColumnRight: "Align column right",
	},
	fields: {
		url: "URL",
		image: "Image",
		file: "File",
		alt: "Alternative text",
		altDescription: "Read aloud to someone who cannot see the image.",
		caption: "Caption",
		columnsDesktop: "Columns (desktop)",
		columnsMobile: "Columns (mobile)",
		columnsMobileDescription:
			"A different column count on mobile relies on a media query: the Gmail app on a third-party account ignores it and falls back to one column.",
		align: "Alignment",
		alignLeft: "Left",
		alignCenter: "Center",
		alignRight: "Right",
		buttonLabel: "Label",
		buttonPlaceholder: "Your button",
		buttonLink: "Link",
		buttonStyle: "Style",
		buttonPrimary: "Filled (brand color)",
		buttonSecondary: "Outline",
		statValue: "Figure",
		statValuePlaceholder: "128",
		statLabel: "Label",
		statLabelPlaceholder: "Projects delivered",
		statDescription: "Description (optional)",
		imageLink: "Link",
		imageLinkDescription: "Where a click on the image leads. Empty for none.",
		imageSize: "Width",
		imageSizeFull: "Full width",
		imageSizeContained: "Reduced width (centered)",
		imageOverlay: "Overlay",
		imageOverlayNone: "None",
		imageOverlayPlay: "Play button (video thumbnail)",
		imageOverlayPlayDescription:
			"No email client plays an embedded video: the thumbnail links to the link above.",
		articleTitle: "Title",
		articleTitlePlaceholder: "Article title",
		articleDescription: "Summary",
		articleDescriptionPlaceholder: "The article summary.",
		articleImage: "Image",
		articleAuthor: "Author",
		articlePublishDate: "Publication date",
		articlePublishDatePlaceholder: "2026-07-20",
		articlePublishDateDescription:
			"YYYY-MM-DD; each reader sees it written in their own language.",
		articleHref: "Link",
		articleHrefDescription: "The card links to this address.",
		productName: "Name",
		productNamePlaceholder: "Product name",
		productDescription: "Description",
		productDescriptionPlaceholder: "The product description.",
		productImage: "Image",
		productPrice: "Price",
		productCompareAtPrice: "Base price",
		productCompareAtPriceDescription:
			"Shown struck through next to the price. Leave empty when the product is not discounted.",
		productHref: "Link",
		productButtonLabel: "Button label",
		productButtonLabelPlaceholder: "Order now",
		productButtonLabelDescription: "Leave empty for a card without a button.",
		offerEyebrow: "Eyebrow",
		offerEyebrowPlaceholder: "Most popular",
		offerName: "Name",
		offerNamePlaceholder: "Offer name",
		offerDescription: "Description",
		offerImage: "Image",
		offerImageDescription: "Leave empty for an offer without a visual.",
		offerPrice: "Price",
		offerPeriod: "Billing period",
		offerPeriodPlaceholder: "per month",
		offerPeriodDescription: "Leave empty for a one-off price.",
		offerFeature: "Included feature",
		offerButtonLabel: "Button label",
		offerButtonLabelPlaceholder: "Choose this offer",
		offerButtonLabelDescription: "Leave empty for a card without a button.",
		offerButtonHref: "Button link",
		offerHighlighted: "Highlight",
		offerHighlightedDescription:
			"Frames the card in the brand color: the recommended plan of a row.",
		ratingQuestionPlaceholder: "How did your last session go?",
		ratingStyle: "Style",
		ratingStyleFilled: "Filled stars",
		ratingStyleOutline: "Outlined stars",
		ratingLowLabel: "Low end of the scale",
		ratingLowLabelPlaceholder: "Not at all",
		ratingHighLabel: "High end of the scale",
		ratingHighLabelPlaceholder: "Absolutely",
		ratingHref: "Link",
		ratingHrefDescription:
			"Each star links here with rating=1 to rating=5 appended, so the click statistics count each score apart.",
		tableHeaderRow: "Header row",
		tableColumn: "Column",
		tableAlignLeft: "Aligned left",
		tableAlignRight: "Aligned right",
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
		fields: { ...DEFAULT_CONTENT_EDITOR_LABELS.fields, ...input.fields },
	};
}
