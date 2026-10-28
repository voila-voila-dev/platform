import type {
	ContentNodeLike,
	ContentNodeReader,
} from "@voila.dev/ui/content-editor/reader";
import { escapeHtml } from "@voila.dev/ui/content-editor/reader";
import { cn } from "@voila.dev/ui/utils";
import type { ReactNode } from "react";

/**
 * What a box set apart in an article tells the reader, which picks its look,
 * its icon and the word printed above it: `summary` is the answer up front,
 * `danger` the case where the reader must act now.
 */
export const ARTICLE_CALLOUT_VARIANTS = [
	"summary",
	"info",
	"tip",
	"warning",
	"danger",
] as const;
export type ArticleCalloutVariant = (typeof ARTICLE_CALLOUT_VARIANTS)[number];

/** A callout stored before the variants existed reads as a plain note. */
export function articleCalloutVariantOf(value: unknown): ArticleCalloutVariant {
	return (
		ARTICLE_CALLOUT_VARIANTS.find((variant) => variant === value) ?? "info"
	);
}

/**
 * A box set apart in an article. `title` is optional; `icon` is the emoji the
 * kit's own callout stored, kept so a body written before the variants still
 * decodes, and never drawn: the variant picks the icon.
 */
export interface ArticleCalloutNode extends ContentNodeLike {
	readonly type: "callout";
	readonly id?: string;
	readonly variant?: string;
	readonly title?: string;
	readonly icon?: string;
}

/** The word printed above each variant, so its meaning never rests on colour. */
export type ArticleCalloutLabels = Readonly<
	Record<ArticleCalloutVariant, string>
>;

export interface ArticleCalloutOptions {
	readonly labels: ArticleCalloutLabels;
	/**
	 * Reads the stored variant, for a host whose articles name theirs
	 * differently. Defaults to `articleCalloutVariantOf`.
	 */
	readonly variantOf?: (value: unknown) => ArticleCalloutVariant;
}

interface CalloutStyle {
	/** Phosphor's bold glyph, on its 256 grid. */
	readonly iconPath: string;
	readonly frame: string;
	readonly icon: string;
	readonly label: string;
}

const CALLOUT_STYLES: Readonly<Record<ArticleCalloutVariant, CalloutStyle>> = {
	summary: {
		iconPath:
			"M228,128a12,12,0,0,1-12,12H128a12,12,0,0,1,0-24h88A12,12,0,0,1,228,128ZM128,76h88a12,12,0,0,0,0-24H128a12,12,0,0,0,0,24Zm88,104H128a12,12,0,0,0,0,24h88a12,12,0,0,0,0-24ZM79.51,39.51,56,63l-7.51-7.52a12,12,0,0,0-17,17l16,16a12,12,0,0,0,17,0l32-32a12,12,0,0,0-17-17Zm0,64L56,127l-7.51-7.52a12,12,0,1,0-17,17l16,16a12,12,0,0,0,17,0l32-32a12,12,0,0,0-17-17Zm0,64L56,191l-7.51-7.52a12,12,0,1,0-17,17l16,16a12,12,0,0,0,17,0l32-32a12,12,0,0,0-17-17Z",
		frame: "border-brand/25 bg-brand/[0.06]",
		icon: "text-brand",
		label: "text-brand",
	},
	info: {
		iconPath:
			"M108,84a16,16,0,1,1,16,16A16,16,0,0,1,108,84Zm128,44A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Zm-72,36.68V132a20,20,0,0,0-20-20,12,12,0,0,0-4,23.32V168a20,20,0,0,0,20,20,12,12,0,0,0,4-23.32Z",
		frame: "border-border bg-foreground/[0.03]",
		icon: "text-foreground/60",
		label: "text-foreground",
	},
	tip: {
		iconPath:
			"M180,232a12,12,0,0,1-12,12H88a12,12,0,0,1,0-24h80A12,12,0,0,1,180,232Zm40-128a91.51,91.51,0,0,1-35.17,72.35A12.26,12.26,0,0,0,180,186v2a20,20,0,0,1-20,20H96a20,20,0,0,1-20-20v-2a12,12,0,0,0-4.7-9.51A91.57,91.57,0,0,1,36,104.52C35.73,54.69,76,13.2,125.79,12A92,92,0,0,1,220,104Zm-24,0a68,68,0,0,0-69.65-68C89.56,36.88,59.8,67.55,60,104.38a67.71,67.71,0,0,0,26.1,53.19A35.87,35.87,0,0,1,100,184h56.1A36.13,36.13,0,0,1,170,157.49,67.68,67.68,0,0,0,196,104Zm-20.07-5.32a48.5,48.5,0,0,0-31.91-40,12,12,0,0,0-8,22.62,24.31,24.31,0,0,1,16.09,20,12,12,0,0,0,23.86-2.64Z",
		frame: "border-success/25 bg-success/[0.06]",
		icon: "text-success",
		label: "text-foreground",
	},
	warning: {
		iconPath:
			"M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z",
		frame: "border-warning/40 bg-warning/[0.09]",
		icon: "text-warning",
		label: "text-foreground",
	},
	danger: {
		iconPath:
			"M116,20V12a12,12,0,0,1,24,0v8a12,12,0,0,1-24,0Zm84,36a12,12,0,0,0,8.49-3.51l8-8a12,12,0,1,0-17-17l-8,8A12,12,0,0,0,200,56ZM47.51,52.49a12,12,0,0,0,17-17l-8-8a12,12,0,0,0-17,17ZM236,176v24a20,20,0,0,1-20,20H40a20,20,0,0,1-20-20V176a20,20,0,0,1,16-19.6V140a92,92,0,0,1,92-92h.71C179,48.38,220,90.1,220,141v15.4A20,20,0,0,1,236,176ZM60,140v16H196V141c0-37.77-30.27-68.72-67.48-69H128a68,68,0,0,0-68,68Zm152,40H44v16H212Zm-75.6-66.72a28,28,0,0,1,18.32,18.32,12,12,0,0,0,22.9-7.2,52,52,0,0,0-34-34,12,12,0,0,0-7.2,22.9Z",
		frame: "border-destructive/40 bg-destructive/[0.07]",
		icon: "text-destructive",
		label: "text-destructive",
	},
};

const FRAME = "my-8 flex flex-col gap-3 rounded-2xl border px-5 py-4 sm:px-6";
const HEADER = "flex items-center gap-2";
const ICON = "size-5 shrink-0";
const LABEL =
	"font-semibold text-[0.8125rem] uppercase leading-5 tracking-wide";
const TITLE = "font-semibold text-foreground text-[1.0625em] leading-snug";
const BODY =
	"text-[0.9em] leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_li]:my-1 [&_li]:marker:text-foreground/50 [&_p]:my-2 [&_p]:text-foreground/85";

interface ResolvedCallout {
	readonly variant: ArticleCalloutVariant;
	readonly style: CalloutStyle;
	readonly label: string;
	readonly title: string | null;
	readonly accessibleName: string;
}

function comparable(text: string): string {
	return text
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/gu, "")
		.replace(/[^\p{L}\p{N}]+/gu, " ")
		.trim()
		.toLowerCase();
}

/** A title that only repeats the label ("In short" under IN SHORT) would print the same words twice. */
function distinctTitle(title: unknown, label: string): string | null {
	if (typeof title !== "string") return null;
	const trimmed = title.trim();
	if (trimmed === "" || comparable(trimmed) === comparable(label)) return null;
	return trimmed;
}

function resolveCallout(
	node: ArticleCalloutNode,
	options: ArticleCalloutOptions,
): ResolvedCallout {
	const variant = (options.variantOf ?? articleCalloutVariantOf)(node.variant);
	const label = options.labels[variant];
	const title = distinctTitle(node.title, label);
	return {
		variant,
		style: CALLOUT_STYLES[variant],
		label,
		title,
		accessibleName: title === null ? label : `${label}: ${title}`,
	};
}

function CalloutIcon({ path, className }: { path: string; className: string }) {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 256 256"
			fill="currentColor"
			className={cn(ICON, className)}
		>
			<path d={path} />
		</svg>
	);
}

export function ArticleCallout({
	node,
	options,
	children,
}: {
	readonly node: ArticleCalloutNode;
	readonly options: ArticleCalloutOptions;
	readonly children: ReactNode;
}) {
	const { variant, style, label, title, accessibleName } = resolveCallout(
		node,
		options,
	);
	return (
		<aside
			id={node.id}
			role="note"
			aria-label={accessibleName}
			data-variant={variant}
			className={cn(FRAME, style.frame)}
		>
			<div className={HEADER} contentEditable={false}>
				<CalloutIcon path={style.iconPath} className={style.icon} />
				<span className={cn(LABEL, style.label)}>{label}</span>
			</div>
			{title === null ? null : (
				<div className={TITLE} contentEditable={false}>
					{title}
				</div>
			)}
			<div className={BODY}>{children}</div>
		</aside>
	);
}

function calloutHtml(
	node: ArticleCalloutNode,
	options: ArticleCalloutOptions,
	children: string,
	id: string | undefined,
): string {
	const { variant, style, label, title, accessibleName } = resolveCallout(
		node,
		options,
	);
	const idAttribute = id === undefined ? "" : ` id="${escapeHtml(id)}"`;
	const titleHtml =
		title === null ? "" : `<div class="${TITLE}">${escapeHtml(title)}</div>`;
	return `<aside${idAttribute} role="note" aria-label="${escapeHtml(accessibleName)}" data-variant="${variant}" class="${cn(FRAME, style.frame)}"><div class="${HEADER}"><svg aria-hidden="true" viewBox="0 0 256 256" fill="currentColor" class="${cn(ICON, style.icon)}"><path d="${style.iconPath}"/></svg><span class="${cn(LABEL, style.label)}">${escapeHtml(label)}</span></div>${titleHtml}<div class="${BODY}">${children}</div></aside>`;
}

export function articleCalloutNode(
	callout: ArticleCalloutOptions,
): ContentNodeReader<ArticleCalloutNode> {
	return {
		type: "callout",
		Render: ({ node, children, options }) => (
			<ArticleCallout
				node={{ ...node, id: options.idFor?.(node) ?? node.id }}
				options={callout}
			>
				{children}
			</ArticleCallout>
		),
		toHtml: (node, children, options) =>
			calloutHtml(node, callout, children, options.idFor?.(node) ?? node.id),
	};
}
