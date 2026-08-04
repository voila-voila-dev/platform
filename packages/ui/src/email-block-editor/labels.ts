import type { EmailEditorBlockType } from "#/email-block-editor/document/types.ts";

/**
 * Every string the editor puts on screen. There is no i18n runtime here: the
 * host already has one, and a package that shipped its own would fight it. So
 * the editor takes its copy as data, in sections, and a consumer overrides the
 * sections it cares about.
 *
 * A label that reads an index is a function rather than a template with a
 * placeholder — `Item 3` and `3e élément` do not share a word order, and a
 * function is the only shape that survives that.
 */

/** The editor's own chrome: toolbars, menus, popovers, the empty states. */
export interface EmailEditorChromeLabels {
	readonly preview: string;
	readonly previewDesktop: string;
	readonly previewMobile: string;
	readonly addBlock: string;
	readonly moveBlock: string;
	readonly duplicateBlock: string;
	readonly deleteBlock: string;
	readonly blockSettings: string;
	readonly blockSettingsDescription: string;
	readonly selectContainer: string;
	readonly selectBlockPrompt: string;
	readonly noBlockSettings: string;
	readonly emptyDocument: string;
	readonly headerPlaceholder: string;
	readonly footerPlaceholder: string;
	readonly bold: string;
	readonly italic: string;
	readonly underline: string;
	readonly insertLink: string;
	readonly linkUrl: string;
	readonly apply: string;
	readonly removeLink: string;
	/** The three headings a settings panel groups its options under. */
	readonly sectionContent: string;
	readonly sectionAppearance: string;
	readonly sectionLink: string;
}

/**
 * What each block is called in the add-block menu. Separate from `blocks`
 * because this one is indexed by type: the menu holds a type and needs a name,
 * with no idea which block it is. A consumer's own block falls back to the
 * `label` on its definition.
 */
export type EmailEditorBlockNameLabels = {
	readonly [Type in EmailEditorBlockType]: string;
};

/**
 * The vocabulary shared across settings panels. "Alt text" means the same
 * thing in an image, an article and an offer, so it is written once.
 */
export interface EmailEditorFieldLabels {
	readonly alignment: string;
	readonly alignLeft: string;
	readonly alignCenter: string;
	readonly alignRight: string;
	readonly link: string;
	readonly urlPlaceholder: string;
	readonly currency: string;
	readonly altText: string;
	readonly altTextDescription: string;
	readonly imageUrl: string;
	readonly uploadImage: string;
	readonly replaceImage: string;
	readonly addImage: string;
	readonly uploading: string;
	readonly title: string;
	readonly summary: string;
	readonly author: string;
	readonly text: string;
	readonly label: string;
	readonly style: string;
	readonly name: string;
	readonly description: string;
	readonly price: string;
	readonly buttonLabel: string;
	readonly value: string;
	readonly left: string;
	readonly right: string;
	readonly none: string;
}

export interface EmailEditorBlockLabels {
	readonly heading: {
		readonly ariaLabel: string;
		readonly placeholder: string;
		readonly level: string;
		readonly level1: string;
		readonly level2: string;
	};
	readonly paragraph: {
		readonly ariaLabel: string;
		readonly placeholder: string;
	};
	readonly button: {
		readonly ariaLabel: string;
		readonly placeholder: string;
		readonly variantPrimary: string;
		readonly variantSecondary: string;
		readonly variantSecondaryDescription: string;
	};
	readonly image: {
		readonly width: string;
		readonly widthFull: string;
		readonly widthContained: string;
		readonly overlay: string;
		readonly overlayPlay: string;
		readonly overlayPlayDescription: string;
		readonly rounded: string;
		readonly roundedDescription: string;
		readonly linkDescription: string;
	};
	readonly list: {
		readonly items: string;
		readonly item: (index: number) => string;
		readonly removeItem: (index: number) => string;
		readonly addItem: string;
		readonly itemPlaceholder: string;
		readonly marker: string;
		readonly markerBullet: string;
		readonly markerNumber: string;
		readonly markerBadge: string;
		readonly formattingHint: string;
	};
	readonly stat: {
		readonly valuePlaceholder: string;
		readonly labelPlaceholder: string;
		readonly descriptionPlaceholder: string;
	};
	readonly highlight: {
		readonly ariaLabel: string;
		readonly placeholder: string;
	};
	readonly finePrint: {
		readonly ariaLabel: string;
		readonly placeholder: string;
	};
	readonly table: {
		readonly rowCount: (count: number) => string;
		readonly removeLastRow: string;
		readonly addRow: string;
		readonly headerRow: string;
		readonly columnPlaceholder: string;
		readonly column: (index: number) => string;
		readonly columnTitle: (index: number) => string;
		readonly cell: (row: number, column: number) => string;
		readonly removeColumn: (index: number) => string;
		readonly addColumn: string;
	};
	readonly article: {
		readonly titleAriaLabel: string;
		readonly titlePlaceholder: string;
		readonly summaryAriaLabel: string;
		readonly summaryPlaceholder: string;
		readonly publishDate: string;
		readonly publishDatePlaceholder: string;
		readonly publishDateDescription: string;
		readonly linkDescription: string;
	};
	readonly product: {
		readonly nameAriaLabel: string;
		readonly namePlaceholder: string;
		readonly descriptionAriaLabel: string;
		readonly descriptionPlaceholder: string;
		readonly compareAtPrice: string;
		readonly compareAtPriceToggle: string;
		readonly compareAtPriceDescription: string;
		readonly buttonLabelPlaceholder: string;
		readonly buttonLabelDescription: string;
	};
	readonly offer: {
		readonly nameAriaLabel: string;
		readonly namePlaceholder: string;
		readonly eyebrow: string;
		readonly eyebrowPlaceholder: string;
		readonly period: string;
		readonly periodPlaceholder: string;
		readonly periodDescription: string;
		readonly highlighted: string;
		readonly highlightedDescription: string;
		readonly imageDescription: string;
		readonly features: string;
		readonly feature: (index: number) => string;
		readonly removeFeature: (index: number) => string;
		readonly addFeature: string;
		readonly buttonLabelPlaceholder: string;
		readonly buttonLabelDescription: string;
	};
	readonly rating: {
		readonly ariaLabel: string;
		readonly placeholder: string;
		readonly questionHint: string;
		readonly lowLabel: string;
		readonly lowPlaceholder: string;
		readonly highLabel: string;
		readonly highPlaceholder: string;
		readonly styleFilled: string;
		readonly styleOutline: string;
		readonly linkDescription: string;
	};
	readonly grid: {
		readonly desktopColumns: string;
		readonly mobileColumns: string;
		readonly mobileColumnsDescription: string;
	};
}

export interface EmailEditorLabels {
	readonly chrome: EmailEditorChromeLabels;
	readonly blockNames: EmailEditorBlockNameLabels;
	readonly fields: EmailEditorFieldLabels;
	readonly blocks: EmailEditorBlockLabels;
}

/** An override: any section, any key within it. */
export interface EmailEditorLabelsInput {
	readonly chrome?: Partial<EmailEditorChromeLabels>;
	readonly blockNames?: Partial<EmailEditorBlockNameLabels>;
	readonly fields?: Partial<EmailEditorFieldLabels>;
	readonly blocks?: {
		readonly [Block in keyof EmailEditorBlockLabels]?: Partial<
			EmailEditorBlockLabels[Block]
		>;
	};
}

export const DEFAULT_EMAIL_EDITOR_LABELS: EmailEditorLabels = {
	chrome: {
		preview: "Preview",
		previewDesktop: "Desktop",
		previewMobile: "Mobile",
		addBlock: "Add a block",
		moveBlock: "Move block",
		duplicateBlock: "Duplicate block",
		deleteBlock: "Delete block",
		blockSettings: "Block settings",
		blockSettingsDescription: "Options for the selected block.",
		selectContainer: "Select the column row",
		selectBlockPrompt: "Select a block to edit its settings.",
		noBlockSettings: "This block has no settings.",
		emptyDocument: "Your email is empty.",
		headerPlaceholder: "Your header",
		footerPlaceholder:
			"The full footer (contact details, social links, unsubscribe) is added when the email is sent.",
		bold: "Bold",
		italic: "Italic",
		underline: "Underline",
		insertLink: "Insert a link",
		linkUrl: "Link URL",
		apply: "Apply",
		removeLink: "Remove link",
		sectionContent: "Content",
		sectionAppearance: "Appearance",
		sectionLink: "Link",
	},
	blockNames: {
		heading: "Heading",
		paragraph: "Paragraph",
		button: "Button",
		image: "Image",
		divider: "Divider",
		list: "List",
		stat: "Key figure",
		highlight: "Highlight",
		table: "Table",
		article: "Article",
		product: "Product",
		offer: "Offer",
		rating: "Rating",
		finePrint: "Fine print",
		grid: "Columns",
	},
	fields: {
		alignment: "Alignment",
		alignLeft: "Align left",
		alignCenter: "Align center",
		alignRight: "Align right",
		link: "Link (URL)",
		urlPlaceholder: "https://",
		currency: "Currency",
		altText: "Alt text",
		altTextDescription: "Shown when the email client blocks the image.",
		imageUrl: "Image URL",
		uploadImage: "Upload an image",
		replaceImage: "Replace the image",
		addImage: "Add an image",
		uploading: "Uploading…",
		title: "Title",
		summary: "Summary",
		author: "Author",
		text: "Text",
		label: "Label",
		style: "Style",
		name: "Name",
		description: "Description",
		price: "Price",
		buttonLabel: "Button label",
		value: "Value",
		left: "Left",
		right: "Right",
		none: "None",
	},
	blocks: {
		heading: {
			ariaLabel: "Heading",
			placeholder: "Your heading",
			level: "Level",
			level1: "Main title (H1)",
			level2: "Subtitle (H2)",
		},
		paragraph: {
			ariaLabel: "Paragraph",
			placeholder: "Your text. Use {{firstName}} to personalize.",
		},
		button: {
			ariaLabel: "Button label",
			placeholder: "Your button",
			variantPrimary: "Filled (brand color)",
			variantSecondary: "Outline",
			variantSecondaryDescription:
				"Outlook (Word engine) ignores rounded corners: the outline will have square corners there.",
		},
		image: {
			width: "Width",
			widthFull: "Full width",
			widthContained: "Reduced width (centered)",
			overlay: "Overlay",
			overlayPlay: "Play button (video thumbnail)",
			overlayPlayDescription:
				"No email client plays an embedded video: the thumbnail links to the URL below. Outlook shows the badge under the image.",
			rounded: "Rounded corners",
			roundedDescription:
				"Outlook (Word engine) always renders square corners.",
			linkDescription: "Leave empty for a non-clickable image.",
		},
		list: {
			items: "Items",
			item: (index) => `Item ${index}`,
			removeItem: (index) => `Remove item ${index}`,
			addItem: "Add an item",
			itemPlaceholder: "Your text",
			marker: "Marker",
			markerBullet: "Bullet",
			markerNumber: "Number",
			markerBadge: "Numbered badge",
			formattingHint:
				"Each item's text is formatted from the block toolbar, like a paragraph. Enter starts the next item, Shift+Enter breaks the line inside one.",
		},
		stat: {
			valuePlaceholder: "128",
			labelPlaceholder: "Projects delivered",
			descriptionPlaceholder: "Description (optional)",
		},
		highlight: {
			ariaLabel: "Highlight",
			placeholder: "10% off everything with the code LAUNCH10",
		},
		finePrint: {
			ariaLabel: "Fine print",
			placeholder: "Offer valid until…",
		},
		table: {
			rowCount: (count) => `${count} row${count > 1 ? "s" : ""}`,
			removeLastRow: "Remove the last row",
			addRow: "Row",
			headerRow: "Header row",
			columnPlaceholder: "Column",
			column: (index) => `Column ${index}`,
			columnTitle: (index) => `Column ${index} title`,
			cell: (row, column) => `Row ${row}, column ${column}`,
			removeColumn: (index) => `Remove column ${index}`,
			addColumn: "Add a column",
		},
		article: {
			titleAriaLabel: "Article title",
			titlePlaceholder: "Article title",
			summaryAriaLabel: "Article summary",
			summaryPlaceholder: "The article summary.",
			publishDate: "Publication date",
			publishDatePlaceholder: "2026-07-20",
			publishDateDescription:
				"YYYY-MM-DD format; the date is written in the recipient's language at send time.",
			linkDescription: "The whole card links to this address.",
		},
		product: {
			nameAriaLabel: "Product name",
			namePlaceholder: "Product name",
			descriptionAriaLabel: "Product description",
			descriptionPlaceholder: "The product description.",
			compareAtPrice: "Base price",
			compareAtPriceToggle: "Struck-through base price",
			compareAtPriceDescription:
				"Shows a struck-through price next to the current price.",
			buttonLabelPlaceholder: "Order now",
			buttonLabelDescription: "Leave empty for a card without a button.",
		},
		offer: {
			nameAriaLabel: "Offer name",
			namePlaceholder: "Offer name",
			eyebrow: "Eyebrow",
			eyebrowPlaceholder: "Most popular",
			period: "Billing period",
			periodPlaceholder: "per month",
			periodDescription: "Leave empty for a one-off price.",
			highlighted: "Highlight",
			highlightedDescription:
				"Frames the card in the brand color. Outlook (Word engine) renders square corners.",
			imageDescription: "Leave empty for an offer without a visual.",
			features: "Included features",
			feature: (index) => `Included feature ${index}`,
			removeFeature: (index) => `Remove feature ${index}`,
			addFeature: "Add a feature",
			buttonLabelPlaceholder: "Choose this offer",
			buttonLabelDescription: "Leave empty for a card without a button.",
		},
		rating: {
			ariaLabel: "Question",
			placeholder: "How did your last project go?",
			questionHint:
				"The question is typed and formatted directly on the block, like a paragraph.",
			lowLabel: "Low end of the scale",
			lowPlaceholder: "Not at all",
			highLabel: "High end of the scale",
			highPlaceholder: "Absolutely",
			styleFilled: "Filled stars",
			styleOutline: "Outlined stars",
			linkDescription:
				"Each star points to this address with rating=1 through rating=5 appended: the five scores are therefore counted separately in the click statistics.",
		},
		grid: {
			desktopColumns: "Columns (desktop)",
			mobileColumns: "Columns (mobile)",
			mobileColumnsDescription:
				"A different column count on mobile relies on a media query: the Gmail app on a third-party account ignores it and falls back to one column.",
		},
	},
};

/**
 * The defaults with an override laid over them, one section at a time — and,
 * inside `blocks`, one block at a time. Not a deep merge: every level here has
 * a known shape, and spelling the spreads out is what keeps a single
 * overridden key from replacing its whole section.
 */
export const mergeEmailEditorLabels = (
	labels: EmailEditorLabelsInput | undefined,
): EmailEditorLabels => {
	if (labels === undefined) {
		return DEFAULT_EMAIL_EDITOR_LABELS;
	}
	const defaults = DEFAULT_EMAIL_EDITOR_LABELS;
	const blocks = labels.blocks ?? {};
	return {
		chrome: { ...defaults.chrome, ...labels.chrome },
		blockNames: { ...defaults.blockNames, ...labels.blockNames },
		fields: { ...defaults.fields, ...labels.fields },
		blocks: {
			heading: { ...defaults.blocks.heading, ...blocks.heading },
			paragraph: { ...defaults.blocks.paragraph, ...blocks.paragraph },
			button: { ...defaults.blocks.button, ...blocks.button },
			image: { ...defaults.blocks.image, ...blocks.image },
			list: { ...defaults.blocks.list, ...blocks.list },
			stat: { ...defaults.blocks.stat, ...blocks.stat },
			highlight: { ...defaults.blocks.highlight, ...blocks.highlight },
			finePrint: { ...defaults.blocks.finePrint, ...blocks.finePrint },
			table: { ...defaults.blocks.table, ...blocks.table },
			article: { ...defaults.blocks.article, ...blocks.article },
			product: { ...defaults.blocks.product, ...blocks.product },
			offer: { ...defaults.blocks.offer, ...blocks.offer },
			rating: { ...defaults.blocks.rating, ...blocks.rating },
			grid: { ...defaults.blocks.grid, ...blocks.grid },
		},
	};
};
