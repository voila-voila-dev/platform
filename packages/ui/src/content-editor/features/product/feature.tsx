import { TagIcon } from "@phosphor-icons/react";
import { ElementApi } from "platejs";
import { createPlatePlugin } from "platejs/react";
import { ProductView } from "#/content-editor/features/product/product-view.tsx";
import {
	type ContentProductNode,
	productDefaults,
	productNode,
} from "#/content-editor/features/product/reader.tsx";
import { defineElementFeature } from "#/content-editor/lib/define-element-feature.ts";

export interface ContentPriceFeatureOptions {
	/** The currencies the author picks from; the first is a new card's. Defaults to EUR. */
	readonly currencies?: ReadonlyArray<string>;
}

/**
 * The base price is always in the price's currency, as the email block
 * editor's toggle copied it: its field has no currency of its own, and a
 * change of the price's currency carries over.
 */
const SameCurrencyPlugin = createPlatePlugin({
	key: productNode.type,
	node: { isElement: true, isVoid: true },
}).overrideEditor(({ editor, tf: { normalizeNode } }) => ({
	transforms: {
		normalizeNode: (entry, options) => {
			const [node, path] = entry;
			if (ElementApi.isElement(node) && node.type === productNode.type) {
				const product = node as unknown as ContentProductNode;
				const compareAt = product.compareAtPrice;
				if (
					compareAt != null &&
					product.price !== undefined &&
					compareAt.currency !== product.price.currency
				) {
					editor.tf.setNodes(
						{
							compareAtPrice: {
								...compareAt,
								currency: product.price.currency,
							},
						} as never,
						{ at: path },
					);
					return;
				}
			}
			normalizeNode(entry, options);
		},
	},
}));

export function createProductFeature({
	currencies = ["EUR"],
}: ContentPriceFeatureOptions = {}) {
	return defineElementFeature<ContentProductNode>({
		key: "product",
		kind: "void",
		node: productNode,
		fields: [
			{ type: "text", key: "name", label: "productName" },
			{
				type: "text",
				key: "description",
				label: "productDescription",
				multiline: true,
			},
			{ type: "image", key: "image", label: "productImage", withAlt: true },
			{ type: "money", key: "price", label: "productPrice", currencies },
			{
				type: "money",
				key: "compareAtPrice",
				label: "productCompareAtPrice",
				description: "productCompareAtPriceDescription",
				optional: true,
			},
			{ type: "url", key: "href", label: "productHref" },
			{
				type: "text",
				key: "buttonLabel",
				label: "productButtonLabel",
				placeholder: "productButtonLabelPlaceholder",
				description: "productButtonLabelDescription",
			},
		],
		defaults: productDefaults(currencies[0] ?? "EUR"),
		view: ProductView,
		insert: {
			icon: TagIcon,
			keywords: ["product", "item", "price", "shop", "card"],
		},
		plugins: () => [SameCurrencyPlugin],
	});
}

export const productFeature = createProductFeature();
