import { articleBlockDefinition } from "#/email-block-editor/blocks/article-block.tsx";
import { buttonBlockDefinition } from "#/email-block-editor/blocks/button-block.tsx";
import { dividerBlockDefinition } from "#/email-block-editor/blocks/divider-block.tsx";
import { finePrintBlockDefinition } from "#/email-block-editor/blocks/fine-print-block.tsx";
import { createGridBlockDefinition } from "#/email-block-editor/blocks/grid-block.tsx";
import { headingBlockDefinition } from "#/email-block-editor/blocks/heading-block.tsx";
import { highlightBlockDefinition } from "#/email-block-editor/blocks/highlight-block.tsx";
import { imageBlockDefinition } from "#/email-block-editor/blocks/image-block.tsx";
import { listBlockDefinition } from "#/email-block-editor/blocks/list-block.tsx";
import { createOfferBlockDefinition } from "#/email-block-editor/blocks/offer-block.tsx";
import { paragraphBlockDefinition } from "#/email-block-editor/blocks/paragraph-block.tsx";
import { createProductBlockDefinition } from "#/email-block-editor/blocks/product-block.tsx";
import { ratingBlockDefinition } from "#/email-block-editor/blocks/rating-block.tsx";
import { statBlockDefinition } from "#/email-block-editor/blocks/stat-block.tsx";
import { tableBlockDefinition } from "#/email-block-editor/blocks/table-block.tsx";
import type { EmailEditorBuiltInLeafBlock } from "#/email-block-editor/document/types.ts";

export interface EmailBlocksOptions<Currency extends string> {
	/**
	 * The currency a fresh price block starts in. Required, with no default:
	 * defaulting it to `string` would make a document of a host that narrows
	 * its currencies stop being assignable, and the error would land in a file
	 * that has nothing to do with money.
	 *
	 * Pass your own currency type rather than a literal — `"EUR" as
	 * SupportedCurrency`, not `"EUR"` — so adding a second currency later does
	 * not break assignability.
	 */
	readonly currency: Currency;
}

/**
 * The blocks this package ships, as a definition list ready for
 * `createEmailBlockRegistry`. A tuple, not an array, so `EmailEditorBlockOf`
 * sees each definition's own block type and the union comes back exact.
 *
 * Drop one you do not want, add your own, reorder them — the add-block menu
 * follows this order.
 */
export const createEmailBlocks = <Currency extends string>({
	currency,
}: EmailBlocksOptions<Currency>) =>
	[
		headingBlockDefinition,
		paragraphBlockDefinition,
		buttonBlockDefinition,
		imageBlockDefinition,
		dividerBlockDefinition,
		listBlockDefinition,
		statBlockDefinition,
		highlightBlockDefinition,
		tableBlockDefinition,
		articleBlockDefinition,
		createProductBlockDefinition(currency),
		createOfferBlockDefinition(currency),
		ratingBlockDefinition,
		finePrintBlockDefinition,
		createGridBlockDefinition<EmailEditorBuiltInLeafBlock<Currency>>(),
	] as const;
