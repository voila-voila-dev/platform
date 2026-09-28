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
 * A pricing plan. The attributes are the email block editor's `offer`
 * block, name for name, so a stored campaign converts one to one.
 */
export interface ContentOfferNode extends ContentNodeLike {
	readonly type: "offer";
	readonly id?: string;
	readonly eyebrow: string;
	readonly name: string;
	readonly description: string;
	/** An empty `src` means an offer without a visual. */
	readonly image: ContentCardImage;
	readonly price: ContentMoney;
	/** "per month", "per year"; empty for a one-off price. */
	readonly period: string;
	readonly features: ReadonlyArray<string>;
	/** Empty for a card without a button. */
	readonly buttonLabel: string;
	readonly buttonHref: string;
	/** Draws the card in the brand colour: the recommended plan of a row. */
	readonly highlighted: boolean;
}

export function offerDefaults(
	currency: string,
): ContentElementDefaults<ContentOfferNode> {
	return {
		eyebrow: "",
		name: "",
		description: "",
		image: { src: "", alt: "" },
		price: { amountInMinorUnits: 0, currency },
		period: "",
		features: [],
		buttonLabel: "",
		buttonHref: "",
		highlighted: false,
	};
}

const DEFAULTS = offerDefaults("EUR");
const DEFAULT_LOCALE = "en-US";

export const offerNode: ContentNodeReader<ContentOfferNode> = {
	type: "offer",
	kind: "void",
	Render: ({ node: stored, options }) => {
		const node = { ...DEFAULTS, ...stored };
		const features = node.features.filter((feature) => feature !== "");
		return (
			<article
				id={options.idFor?.(node) ?? node.id}
				data-highlighted={node.highlighted || undefined}
				className={kitClassName(
					options,
					"offer",
					`overflow-hidden rounded-xl bg-card ${node.highlighted ? "border-2 border-primary" : "border border-border"}`,
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
					{node.eyebrow ? (
						<p className="font-semibold text-primary text-xs uppercase tracking-wide">
							{node.eyebrow}
						</p>
					) : null}
					<h3 className="font-semibold text-lg">{node.name}</h3>
					<p className="flex items-baseline gap-1.5">
						<strong className="text-2xl">
							{formatPreviewPrice(node.price, options.locale ?? DEFAULT_LOCALE)}
						</strong>
						{node.period ? (
							<span className="text-muted-foreground text-sm">
								{node.period}
							</span>
						) : null}
					</p>
					{node.description ? <p>{node.description}</p> : null}
					{features.length > 0 ? (
						<ul className="list-disc pl-5">
							{features.map((feature, index) => (
								<li key={index}>{feature}</li>
							))}
						</ul>
					) : null}
					{node.buttonHref && node.buttonLabel ? (
						<a
							href={node.buttonHref}
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
		const features = node.features.filter((feature) => feature !== "");
		const image = node.image.src
			? `<img src="${escapeHtml(node.image.src)}" alt="${escapeHtml(node.image.alt)}" loading="lazy">`
			: "";
		const eyebrow = node.eyebrow ? `<p>${escapeHtml(node.eyebrow)}</p>` : "";
		const period = node.period ? ` ${escapeHtml(node.period)}` : "";
		const price = `<p><strong>${escapeHtml(formatPreviewPrice(node.price, options.locale ?? DEFAULT_LOCALE))}</strong>${period}</p>`;
		const description = node.description
			? `<p>${escapeHtml(node.description)}</p>`
			: "";
		const list =
			features.length > 0
				? `<ul>${features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul>`
				: "";
		const button =
			node.buttonHref && node.buttonLabel
				? `<p><a href="${escapeHtml(node.buttonHref)}">${escapeHtml(node.buttonLabel)}</a></p>`
				: "";
		const highlighted = node.highlighted ? " data-highlighted" : "";
		return `<article${idAttribute(options.idFor?.(node) ?? node.id)}${classAttribute(options.classNameFor?.("offer"))}${highlighted}>${image}${eyebrow}<h3>${escapeHtml(node.name)}</h3>${price}${description}${list}${button}</article>`;
	},
};

export const offerReader = {
	key: "offer",
	nodes: [offerNode],
} satisfies ContentFeatureReader;
