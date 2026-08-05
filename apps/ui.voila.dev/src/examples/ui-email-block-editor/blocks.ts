import {
	createEmailBlockRegistry,
	createEmailBlocks,
} from "@voila.dev/ui/email-block-editor";

/**
 * The block set the docs previews use: everything the package ships, priced in
 * euros. An app builds this once and passes it to every editor it renders.
 */
export const DOCS_EMAIL_BLOCKS = createEmailBlocks({ currency: "EUR" });
export const DOCS_EMAIL_REGISTRY = createEmailBlockRegistry(DOCS_EMAIL_BLOCKS);
