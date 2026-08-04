import type { Icon } from "@phosphor-icons/react";
import type { ComponentType, ReactNode } from "react";
import { articleBlockDefinition } from "#/email-block-editor/blocks/article-block.tsx";
import { buttonBlockDefinition } from "#/email-block-editor/blocks/button-block.tsx";
import { dividerBlockDefinition } from "#/email-block-editor/blocks/divider-block.tsx";
import { finePrintBlockDefinition } from "#/email-block-editor/blocks/fine-print-block.tsx";
import { gridBlockDefinition } from "#/email-block-editor/blocks/grid-block.tsx";
import { headingBlockDefinition } from "#/email-block-editor/blocks/heading-block.tsx";
import { highlightBlockDefinition } from "#/email-block-editor/blocks/highlight-block.tsx";
import { imageBlockDefinition } from "#/email-block-editor/blocks/image-block.tsx";
import { listBlockDefinition } from "#/email-block-editor/blocks/list-block.tsx";
import { offerBlockDefinition } from "#/email-block-editor/blocks/offer-block.tsx";
import { paragraphBlockDefinition } from "#/email-block-editor/blocks/paragraph-block.tsx";
import { productBlockDefinition } from "#/email-block-editor/blocks/product-block.tsx";
import { ratingBlockDefinition } from "#/email-block-editor/blocks/rating-block.tsx";
import { statBlockDefinition } from "#/email-block-editor/blocks/stat-block.tsx";
import { tableBlockDefinition } from "#/email-block-editor/blocks/table-block.tsx";
import type {
	EmailEditorBlock,
	EmailEditorBlockType,
	EmailEditorLeafBlockType,
	EmailEditorPreview,
} from "#/email-block-editor/document/types.ts";

/** What every block component receives, in the canvas and in the sidebar. */
export interface EmailBlockComponentProps<
	B extends EmailEditorBlock = EmailEditorBlock,
> {
	block: B;
	selected: boolean;
	onChange: (block: B) => void;
	onUploadImage?: (file: File) => Promise<string>;
	/** Which rendering the canvas is showing; a block whose layout differs
	 * between a phone and a desktop client reads it. Defaults to `desktop` in
	 * the settings panel, where it is irrelevant. */
	preview?: EmailEditorPreview;
	/** Container blocks only (the grid): the child rows the canvas has already
	 * wired for selection, drag-and-drop and their own toolbars. */
	children?: ReactNode;
}

/**
 * A block that holds other blocks. Declaring this is what makes a block a
 * container: the reducer, the drag-and-drop layer and the canvas all consult it
 * instead of testing for the one container type the package happens to ship.
 */
export interface EmailBlockContainer<B extends EmailEditorBlock> {
	readonly children: (block: B) => ReadonlyArray<EmailEditorBlock>;
	readonly withChildren: (
		block: B,
		children: ReadonlyArray<EmailEditorBlock>,
	) => B;
	/** Which types may be dropped in. Defaults to everything that is not itself
	 * a container — the "one level of nesting" rule, without naming a type. */
	readonly accepts?: (type: string) => boolean;
	/** How the canvas arranges the children. */
	readonly layout?: "grid" | "list";
}

/**
 * Everything the editor knows about one block type. The definition is the
 * single source of truth: what an empty one looks like, whether its content is
 * rich text, and whether it holds other blocks. Adding a block is writing one
 * `blocks/<type>-block.tsx` and registering it below — no central switch to
 * remember.
 */
export interface EmailBlockDefinition<
	B extends EmailEditorBlock = EmailEditorBlock,
> {
	readonly type: B["type"];
	/** Name shown in the add-block menu, unless `labels.blockNames` overrides it. */
	readonly label: string;
	readonly icon: Icon;
	/** A freshly added block, with empty content fields. */
	readonly createEmpty: (id: string) => B;
	/** The WYSIWYG rendering, edited in place on the canvas. */
	readonly View: ComponentType<EmailBlockComponentProps<B>>;
	/** The per-block settings panel; null when the block has none. */
	readonly Settings: ComponentType<EmailBlockComponentProps<B>> | null;
	/** Content edited through the span model, so the toolbar offers
	 * bold/italic/underline/link. */
	readonly richText?: boolean;
	/** Present when the block holds other blocks. */
	readonly container?: EmailBlockContainer<B>;
}

export const EMAIL_BLOCK_DEFINITIONS: {
	readonly [T in EmailEditorBlockType]: EmailBlockDefinition<
		Extract<EmailEditorBlock, { type: T }>
	>;
} = {
	heading: headingBlockDefinition,
	paragraph: paragraphBlockDefinition,
	button: buttonBlockDefinition,
	image: imageBlockDefinition,
	divider: dividerBlockDefinition,
	list: listBlockDefinition,
	stat: statBlockDefinition,
	highlight: highlightBlockDefinition,
	table: tableBlockDefinition,
	article: articleBlockDefinition,
	product: productBlockDefinition,
	offer: offerBlockDefinition,
	rating: ratingBlockDefinition,
	finePrint: finePrintBlockDefinition,
	grid: gridBlockDefinition,
};

export const EMAIL_BLOCK_TYPES = Object.keys(
	EMAIL_BLOCK_DEFINITIONS,
) as ReadonlyArray<EmailEditorBlockType>;

/** The types offered inside a container's cell: everything that is not itself a
 * container, so a new leaf block appears there automatically. */
export const EMAIL_LEAF_BLOCK_TYPES = EMAIL_BLOCK_TYPES.filter(
	(type): type is EmailEditorLeafBlockType =>
		EMAIL_BLOCK_DEFINITIONS[type].container === undefined,
);

/** Look up a block's definition with the union narrowed away — the registry
 * guarantees the definition matches the block's own type. */
export const emailBlockDefinition = (
	block: EmailEditorBlock,
): EmailBlockDefinition =>
	EMAIL_BLOCK_DEFINITIONS[block.type] as EmailBlockDefinition;

/** The definition for a type, or `undefined` for a type this editor does not
 * know — a stored document outliving a block someone removed. */
export const emailBlockDefinitionForType = (
	type: string,
): EmailBlockDefinition | undefined =>
	(EMAIL_BLOCK_DEFINITIONS as Record<string, EmailBlockDefinition | undefined>)[
		type
	];
