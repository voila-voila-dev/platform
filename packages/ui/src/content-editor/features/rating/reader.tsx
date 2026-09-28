import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type { ContentElementDefaults } from "#/content-editor/features/field-definition.ts";
import type {
	ContentFeatureReader,
	ContentNodeReader,
} from "#/content-editor/features/reader-definition.tsx";
import {
	classAttribute,
	escapeHtml,
	idAttribute,
	kitClassName,
} from "#/content-editor/reader/escape-html.ts";

export type ContentRatingStyle = "filled" | "outline";

/**
 * A one-to-five satisfaction question. The question is the node's text,
 * typed and formatted in place; the other attributes are the email block
 * editor's `rating` block, name for name.
 */
export interface ContentRatingNode extends ContentNodeLike {
	readonly type: "rating";
	readonly id?: string;
	readonly style: ContentRatingStyle;
	readonly lowLabel: string;
	readonly highLabel: string;
	/** Each step links here with `rating=N` appended, so the five scores are
	 * five separately counted links. */
	readonly href: string;
}

export const RATING_DEFAULTS: ContentElementDefaults<ContentRatingNode> = {
	style: "filled",
	lowLabel: "",
	highLabel: "",
	href: "",
};

/** The scale, as the domain's `EMAIL_RATING_SCALE`. */
export const RATING_SCALE = [1, 2, 3, 4, 5] as const;

/** `href` with `rating=N` appended, keeping any query it already has. */
export function ratingStepHref(href: string, rating: number): string {
	const [base = "", hash] = href.split("#", 2);
	const separator = base.includes("?") ? "&" : "?";
	return `${base}${separator}rating=${rating}${hash === undefined ? "" : `#${hash}`}`;
}

const STAR = { filled: "★", outline: "☆" } as const;

/** Visually hidden, still read out: a star's name is its score. */
const SCORE_STYLE =
	"position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap";

function stepHtml(node: ContentRatingNode, rating: number): string {
	const inner = `<span aria-hidden="true">${STAR[node.style]}</span><span style="${SCORE_STYLE}">${rating}</span>`;
	return node.href
		? `<a href="${escapeHtml(ratingStepHref(node.href, rating))}">${inner}</a>`
		: `<span>${inner}</span>`;
}

function Step({
	node,
	rating,
}: {
	readonly node: ContentRatingNode;
	readonly rating: number;
}) {
	const inner = (
		<>
			<span aria-hidden>{STAR[node.style]}</span>
			<span className="sr-only">{rating}</span>
		</>
	);
	return node.href ? (
		<a href={ratingStepHref(node.href, rating)}>{inner}</a>
	) : (
		<span>{inner}</span>
	);
}

export const ratingNode: ContentNodeReader<ContentRatingNode> = {
	type: "rating",
	Render: ({ node: stored, children, options }) => {
		const node = { ...RATING_DEFAULTS, ...stored };
		return (
			<div
				id={options.idFor?.(node) ?? node.id}
				className={kitClassName(
					options,
					"rating",
					"flex flex-col items-center gap-2 text-center",
				)}
			>
				<p>{children}</p>
				<p className="flex gap-2 text-2xl text-primary">
					{RATING_SCALE.map((rating) => (
						<Step key={rating} node={node} rating={rating} />
					))}
				</p>
				{node.lowLabel || node.highLabel ? (
					<p className="flex w-full max-w-56 justify-between text-muted-foreground text-xs">
						<span>{node.lowLabel}</span>
						<span>{node.highLabel}</span>
					</p>
				) : null}
			</div>
		);
	},
	toHtml: (stored, children, options) => {
		const node = { ...RATING_DEFAULTS, ...stored };
		const labels =
			node.lowLabel || node.highLabel
				? `<p><span>${escapeHtml(node.lowLabel)}</span> <span>${escapeHtml(node.highLabel)}</span></p>`
				: "";
		return `<div${idAttribute(options.idFor?.(node) ?? node.id)}${classAttribute(options.classNameFor?.("rating"))}><p>${children}</p><p>${RATING_SCALE.map((rating) => stepHtml(node, rating)).join(" ")}</p>${labels}</div>`;
	},
};

export const ratingReader = {
	key: "rating",
	nodes: [ratingNode],
} satisfies ContentFeatureReader;
