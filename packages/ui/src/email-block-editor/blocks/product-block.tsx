import { TagIcon } from "@phosphor-icons/react";
import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import { ProductBlockSettings } from "#/email-block-editor/blocks/product-block-settings.tsx";
import { ProductBlockView } from "#/email-block-editor/blocks/product-block-view.tsx";
import type { EmailEditorProductBlock } from "#/email-block-editor/document/types.ts";

/** A product priced in `currency`: the definition needs it to make an empty
 * block, which is the only place a price comes out of nowhere. */
export const createProductBlockDefinition = <Currency extends string>(
	currency: Currency,
): EmailBlockDefinition<EmailEditorProductBlock<Currency>> => ({
	type: "product",
	label: "Product",
	icon: TagIcon,
	createEmpty: (id) => ({
		id,
		type: "product",
		name: "",
		description: "",
		image: { src: "", alt: "" },
		price: { amountInMinorUnits: 0, currency },
		compareAtPrice: null,
		href: "",
		buttonLabel: "",
	}),
	View: ProductBlockView,
	Settings: ProductBlockSettings,
});
