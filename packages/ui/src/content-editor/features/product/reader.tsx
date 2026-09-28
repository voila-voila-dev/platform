import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type {
	ContentCardImage,
	ContentElementDefaults,
	ContentMoney,
} from "#/content-editor/features/field-definition.ts";
import type {
	ContentFeatureReader,
	ContentNodeReader,
} from "#/content-editor/features/reader-definition.tsx";
import { formatPreviewPrice } from "#/content-editor/lib/money.ts";
import {
	classAttribute,
	escapeHtml,
	idAttribute,
	kitClassName,
} from "#/content-editor/reader/escape-html.ts";

/**
 * A catalogue item. The attributes are the email block editor's `product`
 * block, name for name, so a stored campaign converts one to one.
 */
export interface ContentProductNode extends ContentNodeLike {
	readonly type: "product";
	readonly id?: string;
	readonly name: string;
	readonly description: string;
	readonly image: ContentCardImage;
	readonly price: ContentMoney;
	/**
	 * The struck-through base price; null when the product is not
	 * discounted. Slate drops an attribute set to null, so a cleared price
	 * is absent from the node rather than null: read both as "none".
	 */
	readonly compareAtPrice?: ContentMoney | null;
	readonly href: string;
	/** Empty for a card without a button. */
	readonly buttonLabel: string;
}

export function productDefaults(
	currency: string,
): ContentElementDefaults<ContentProductNode> {
	return {
		name: "",
		description: "",
		image: { src: "", alt: "" },
		price: { amountInMinorUnits: 0, currency },
		compareAtPrice: null,
		href: "",
		buttonLabel: "",
	};
}

const DEFAULTS = productDefaults("EUR");
const DEFAULT_LOCALE = "en-US";

export const productNode: ContentNodeReader<ContentProductNode> = {
	type: "product",
	kind: "void",
	Render: ({ node: stored, options }) => {
		const node = { ...DEFAULTS, ...stored };
		const locale = options.locale ?? DEFAULT_LOCALE;
		return (
			<article
				id={options.idFor?.(node) ?? node.id}
				className={kitClassName(
					options,
					"product",
					"overflow-hidden rounded-xl border border-border bg-card",
				)}
			>
				{node.image.src ? (
					<img
						src={node.image.src}
						alt={node.image.alt}
						loading="lazy"
						className="block h-auto w-full"
					/>
				) : null}
				<div className="flex flex-col gap-2 p-4">
					<h3 className="font-semibold text-lg">{node.name}</h3>
					{node.description ? <p>{node.description}</p> : null}
					<p className="flex items-baseline gap-2">
						<strong>{formatPreviewPrice(node.price, locale)}</strong>
						{node.compareAtPrice == null ? null : (
							<s className="text-muted-foreground text-sm">
								{formatPreviewPrice(node.compareAtPrice, locale)}
							</s>
						)}
					</p>
					{node.href && node.buttonLabel ? (
						<a
							href={node.href}
							className="self-start rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground text-sm"
						>
							{node.buttonLabel}
						</a>
					) : null}
				</div>
			</article>
		);
	},
	toHtml: (stored, _children, options) => {
		const node = { ...DEFAULTS, ...stored };
		const locale = options.locale ?? DEFAULT_LOCALE;
		const image = node.image.src
			? `<img src="${escapeHtml(node.image.src)}" alt="${escapeHtml(node.image.alt)}" loading="lazy">`
			: "";
		const description = node.description
			? `<p>${escapeHtml(node.description)}</p>`
			: "";
		const compareAt =
			node.compareAtPrice == null
				? ""
				: ` <s>${escapeHtml(formatPreviewPrice(node.compareAtPrice, locale))}</s>`;
		const button =
			node.href && node.buttonLabel
				? `<p><a href="${escapeHtml(node.href)}">${escapeHtml(node.buttonLabel)}</a></p>`
				: "";
		return `<article${idAttribute(options.idFor?.(node) ?? node.id)}${classAttribute(options.classNameFor?.("product"))}>${image}<h3>${escapeHtml(node.name)}</h3>${description}<p><strong>${escapeHtml(formatPreviewPrice(node.price, locale))}</strong>${compareAt}</p>${button}</article>`;
	},
};

export const productReader = {
	key: "product",
	nodes: [productNode],
} satisfies ContentFeatureReader;
