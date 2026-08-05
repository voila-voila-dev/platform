/**
 * The editor document model, owned by this package. The domain's
 * `MarketingEmailDocument` Effect Schema mirrors this shape exactly (a
 * type-assertion test in `packages/domain` guards against drift), so a document
 * produced here can be persisted and rendered server-side as-is.
 *
 * Text fields may carry `{{firstName}}` / `{{lastName}}` / `{{email}}`
 * placeholders; substitution happens at render time, not in the editor.
 */
export const EMAIL_EDITOR_DOCUMENT_VERSION = 1;

/**
 * All the editor machinery needs of a block: something to key it by, and
 * something to look its definition up by. Everything else — what fields it
 * has, whether it holds children — is the definition's business.
 */
export interface EmailEditorBlockLike {
	readonly id: string;
	readonly type: string;
}

/**
 * Which rendering of the email the canvas is showing. Not part of the
 * document — it is a view of it — but every block gets it, because what a
 * reader sees depends on it (a grid's column count, the card's width).
 */
export type EmailEditorPreview = "desktop" | "mobile";

/**
 * The shared option vocabulary. Declared once here and mirrored once in the
 * domain schema; a new option reuses one of these rather than inventing a
 * per-block string union (§3.2 of the editor plan).
 */
export type EmailEditorAlignment = "left" | "center" | "right";
export type EmailEditorButtonVariant = "primary" | "secondary";
export type EmailEditorHeadingLevel = 1 | 2;
export type EmailEditorImageWidth = "full" | "contained";
/** No embedded video survives an email client, so a video is a thumbnail with
 * a play badge composited over it. */
export type EmailEditorImageOverlay = "none" | "play";

export interface EmailEditorHeadingBlock {
	readonly id: string;
	readonly type: "heading";
	readonly text: string;
	/** H1 for the email's title, H2 for a section — a long email needs the
	 * hierarchy, and every heading was the same size before. */
	readonly level: EmailEditorHeadingLevel;
}

/**
 * A run of paragraph text sharing the same inline formatting. Rich text is a
 * flat list of these spans — no nesting, trivially safe to render (escape the
 * text, wrap the marks) and to extend with a new mark.
 */
export interface EmailEditorTextSpan {
	readonly text: string;
	readonly bold?: boolean;
	readonly italic?: boolean;
	readonly underline?: boolean;
	/** Present when the run is a link. */
	readonly href?: string;
}

export interface EmailEditorParagraphBlock {
	readonly id: string;
	readonly type: "paragraph";
	readonly spans: ReadonlyArray<EmailEditorTextSpan>;
}

export interface EmailEditorButtonBlock {
	readonly id: string;
	readonly type: "button";
	readonly label: string;
	readonly href: string;
	readonly align: EmailEditorAlignment;
	/** `primary` is the filled brand button, `secondary` the outlined one. */
	readonly variant: EmailEditorButtonVariant;
}

export interface EmailEditorImageBlock {
	readonly id: string;
	readonly type: "image";
	readonly src: string;
	readonly alt: string;
	/** Wraps the image in a link when non-empty. */
	readonly href: string;
	readonly width: EmailEditorImageWidth;
	readonly overlay: EmailEditorImageOverlay;
	/** Rounded corners, on by default. Outlook's Word engine squares them off
	 * regardless — the toggle says so next to it. */
	readonly rounded: boolean;
}

export interface EmailEditorDividerBlock {
	readonly id: string;
	readonly type: "divider";
}

export type EmailEditorListMarker = "bullet" | "number" | "badge";

/** One list entry: the same span model the paragraph uses, so
 * bold/italic/underline/links work inside items for free. */
export interface EmailEditorListItem {
	readonly spans: ReadonlyArray<EmailEditorTextSpan>;
}

export interface EmailEditorListBlock {
	readonly id: string;
	readonly type: "list";
	readonly marker: EmailEditorListMarker;
	readonly items: ReadonlyArray<EmailEditorListItem>;
}

/**
 * A single figure. One stat per block on purpose: a row of three is a
 * three-column grid of stat blocks, not a block that invents its own layout
 * (§1.5 of the editor plan).
 */
export interface EmailEditorStatBlock {
	readonly id: string;
	readonly type: "stat";
	readonly value: string;
	readonly label: string;
	readonly description: string;
	readonly align: EmailEditorAlignment;
}

/**
 * A short promotional line the reader cannot miss — a launch, a promo code, a
 * deadline. One bold sentence on a brand-tinted panel; anything longer belongs
 * in a paragraph.
 */
export interface EmailEditorHighlightBlock {
	readonly id: string;
	readonly type: "highlight";
	readonly text: string;
	readonly align: EmailEditorAlignment;
}

/**
 * The email's small print: offer conditions, validity dates, disclaimers.
 * Rendered small and muted so it reads as a footnote, not as body copy. The
 * span model is the paragraph's, so the conditions can link to the terms.
 */
export interface EmailEditorFinePrintBlock {
	readonly id: string;
	readonly type: "finePrint";
	readonly spans: ReadonlyArray<EmailEditorTextSpan>;
}

export type EmailEditorRatingStyle = "filled" | "outline";

/**
 * A one-to-five satisfaction question. Each step is its own link to `href`
 * with `?rating=N` appended, so the five variants are five separately
 * countable tracked links — the distribution falls out of the click stats.
 */
export interface EmailEditorRatingBlock {
	readonly id: string;
	readonly type: "rating";
	readonly question: ReadonlyArray<EmailEditorTextSpan>;
	readonly style: EmailEditorRatingStyle;
	readonly lowLabel: string;
	readonly highLabel: string;
	readonly href: string;
}

export interface EmailEditorTableColumn {
	readonly label: string;
	readonly align: "left" | "right";
}

/**
 * A price, stored the way a platform should store money: an integer amount in
 * the currency's minor unit plus its currency, never a pre-formatted string —
 * one campaign can go out in several locales, so the formatting happens at
 * render.
 *
 * The currency is a type parameter so a host can narrow it to its own
 * supported set and have a document round-trip through its schema without a
 * cast. `createEmailBlocks({ currency })` fixes it for an editor instance.
 */
export interface EmailEditorMoney<Currency extends string = string> {
	readonly amountInMinorUnits: number;
	readonly currency: Currency;
}

/** The visual of a card block. An empty `src` means the card has none. */
export interface EmailEditorCardImage {
	readonly src: string;
	readonly alt: string;
}

/**
 * A blog post or an external resource. The field names follow the real blog
 * model (`your blog content model`), so composing a digest from published
 * posts is a straight mapping. Empty strings stand for the absent optionals.
 */
export interface EmailEditorArticleBlock {
	readonly id: string;
	readonly type: "article";
	readonly title: string;
	readonly description: string;
	readonly image: EmailEditorCardImage;
	readonly author: string;
	/** ISO date (`YYYY-MM-DD`), formatted for the recipient at render. */
	readonly publishDate: string;
	readonly href: string;
}

export interface EmailEditorProductBlock<Currency extends string = string> {
	readonly id: string;
	readonly type: "product";
	readonly name: string;
	readonly description: string;
	readonly image: EmailEditorCardImage;
	readonly price: EmailEditorMoney<Currency>;
	/** The struck-through base price. Null when the product is not
	 * discounted. */
	readonly compareAtPrice: EmailEditorMoney<Currency> | null;
	readonly href: string;
	readonly buttonLabel: string;
}

export interface EmailEditorOfferBlock<Currency extends string = string> {
	readonly id: string;
	readonly type: "offer";
	readonly eyebrow: string;
	readonly name: string;
	readonly description: string;
	readonly image: EmailEditorCardImage;
	readonly price: EmailEditorMoney<Currency>;
	/** "per month", "per year"; empty for a one-off price. */
	readonly period: string;
	readonly features: ReadonlyArray<string>;
	readonly buttonLabel: string;
	readonly buttonHref: string;
	/** Draws the card in the brand colour — the recommended plan of a row. */
	readonly highlighted: boolean;
}

export interface EmailEditorTableBlock {
	readonly id: string;
	readonly type: "table";
	readonly columns: ReadonlyArray<EmailEditorTableColumn>;
	/** Row-major plain-text cells; a short row renders blank trailing cells. */
	readonly rows: ReadonlyArray<ReadonlyArray<string>>;
	readonly headerRow: boolean;
}

/**
 * The blocks this package ships, minus the grid: everything that can sit
 * inside a cell. "Built-in" because the editor's own types are parameterised
 * over *a* block union — an instance's union is whatever its registered
 * definitions create, which may add to these or leave some out.
 */
export type EmailEditorBuiltInLeafBlock<Currency extends string = string> =
	| EmailEditorHeadingBlock
	| EmailEditorParagraphBlock
	| EmailEditorButtonBlock
	| EmailEditorImageBlock
	| EmailEditorDividerBlock
	| EmailEditorListBlock
	| EmailEditorStatBlock
	| EmailEditorHighlightBlock
	| EmailEditorTableBlock
	| EmailEditorArticleBlock
	| EmailEditorProductBlock<Currency>
	| EmailEditorOfferBlock<Currency>
	| EmailEditorRatingBlock
	| EmailEditorFinePrintBlock;

export type EmailEditorGridColumns = 1 | 2 | 3 | 4;
export type EmailEditorGridMobileColumns = 1 | 2;

/**
 * A multi-column row. `children` is a flat list that *flows* into the columns
 * rather than explicit per-column buckets — that covers every layout we need
 * (a gallery, two article cards, three offers) at a fraction of the
 * complexity, and an asymmetric layout is simply two sibling blocks.
 *
 * `Leaf` is what may go in a cell. A grid is not in its own `Leaf` union, which
 * is how the type says a grid cannot contain a grid.
 */
export interface EmailEditorGridBlock<
	Leaf extends EmailEditorBlockLike = EmailEditorBuiltInLeafBlock,
> {
	readonly id: string;
	readonly type: "grid";
	readonly desktopColumns: EmailEditorGridColumns;
	/** Defaults to 1 so the layout is readable in the clients that ignore the
	 * media query pinning this count (see the renderer). */
	readonly mobileColumns: EmailEditorGridMobileColumns;
	readonly children: ReadonlyArray<Leaf>;
}

export type EmailEditorBuiltInBlock<Currency extends string = string> =
	| EmailEditorBuiltInLeafBlock<Currency>
	| EmailEditorGridBlock<EmailEditorBuiltInLeafBlock<Currency>>;

export type EmailEditorBuiltInBlockType = EmailEditorBuiltInBlock["type"];
export type EmailEditorBuiltInLeafBlockType =
	EmailEditorBuiltInLeafBlock["type"];

/**
 * A document: the version and the blocks, over whatever block union the
 * editor instance is configured with. `Block` appears only inside a
 * `ReadonlyArray`, so it is covariant and a document of a narrower union is a
 * document of a wider one — which is what lets a host's own persisted type and
 * this one be mutually assignable instead of merely similar.
 */
export interface EmailEditorDocument<
	Block extends EmailEditorBlockLike = EmailEditorBuiltInBlock,
> {
	readonly version: typeof EMAIL_EDITOR_DOCUMENT_VERSION;
	readonly blocks: ReadonlyArray<Block>;
}

export const emptyEmailEditorDocument = <
	Block extends EmailEditorBlockLike = EmailEditorBuiltInBlock,
>(): EmailEditorDocument<Block> => ({
	version: EMAIL_EDITOR_DOCUMENT_VERSION,
	blocks: [],
});
