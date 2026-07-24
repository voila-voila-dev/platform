import type { Icon } from "@phosphor-icons/react";
import type { ComponentType, ReactNode } from "react";
import { articleBlockDefinition } from "#/blocks/article-block.tsx";
import { buttonBlockDefinition } from "#/blocks/button-block.tsx";
import { dividerBlockDefinition } from "#/blocks/divider-block.tsx";
import { gridBlockDefinition } from "#/blocks/grid-block.tsx";
import { headingBlockDefinition } from "#/blocks/heading-block.tsx";
import { imageBlockDefinition } from "#/blocks/image-block.tsx";
import { listBlockDefinition } from "#/blocks/list-block.tsx";
import { offerBlockDefinition } from "#/blocks/offer-block.tsx";
import { paragraphBlockDefinition } from "#/blocks/paragraph-block.tsx";
import { productBlockDefinition } from "#/blocks/product-block.tsx";
import { ratingBlockDefinition } from "#/blocks/rating-block.tsx";
import { statBlockDefinition } from "#/blocks/stat-block.tsx";
import { tableBlockDefinition } from "#/blocks/table-block.tsx";
import type {
	EmailEditorBlock,
	EmailEditorBlockType,
	EmailEditorLeafBlockType,
	EmailEditorPreview,
} from "#/document/types.ts";

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
 * Everything the editor needs to know about one block type. Adding a block =
 * add its interface to `document/types.ts` (type union + `createEmailEditorBlock`
 * case), write one `blocks/<type>-block.tsx` exporting a definition, and
 * register it below — the mapped type makes a missing entry a compile error,
 * and the menu, canvas and sidebar all pick it up from here.
 */
export interface EmailBlockDefinition<
	B extends EmailEditorBlock = EmailEditorBlock,
> {
	/** Label shown in the add-block menu. */
	readonly label: string;
	readonly icon: Icon;
	/** The WYSIWYG rendering, edited in place on the canvas. */
	readonly View: ComponentType<EmailBlockComponentProps<B>>;
	/** The per-block settings panel; null when the block has none. */
	readonly Settings: ComponentType<EmailBlockComponentProps<B>> | null;
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
	table: tableBlockDefinition,
	article: articleBlockDefinition,
	product: productBlockDefinition,
	offer: offerBlockDefinition,
	rating: ratingBlockDefinition,
	grid: gridBlockDefinition,
};

export const EMAIL_BLOCK_TYPES = Object.keys(
	EMAIL_BLOCK_DEFINITIONS,
) as ReadonlyArray<EmailEditorBlockType>;

/** The types offered inside a grid cell: everything but the grid, which cannot
 * nest. Derived from the registry so a new leaf block appears automatically. */
export const EMAIL_LEAF_BLOCK_TYPES = EMAIL_BLOCK_TYPES.filter(
	(type): type is EmailEditorLeafBlockType => type !== "grid",
);

/** Look up a block's definition with the union narrowed away — the registry
 * guarantees the definition matches the block's own type. */
export const emailBlockDefinition = (
	block: EmailEditorBlock,
): EmailBlockDefinition =>
	EMAIL_BLOCK_DEFINITIONS[block.type] as EmailBlockDefinition;
