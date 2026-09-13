import type { ComponentType, ReactNode } from "react";
import type {
	ContentDescendant,
	ContentNodeLike,
} from "#/content-editor/features/content-value.ts";

/**
 * The half of a feature a reader needs: how one node kind renders to React
 * and to an HTML string, and how a text mark wraps a leaf. Nothing here
 * imports Plate, so `@voila.dev/ui/content-editor/reader` can run in a
 * server build that only renders stored content.
 */
export interface ContentHtmlOptions {
	/** Intrinsic sizes for `<img width height>`, keyed by url, when the build knows them. */
	readonly imageDimensions?: ReadonlyMap<
		string,
		{ readonly width: number; readonly height: number }
	>;
	/** Extra classes per node type, for a host whose stylesheet names them. */
	readonly classNameFor?: (type: string) => string | undefined;
	/** The anchor id of a node; defaults to its `id` attribute when it has one. */
	readonly idFor?: (node: ContentNodeLike) => string | undefined;
}

export interface ContentRenderProps<N extends ContentNodeLike> {
	readonly node: N;
	/** The rendered subtree; a void node ignores it. */
	readonly children: ReactNode;
	readonly options: ContentHtmlOptions;
}

export interface ContentRunRenderProps<N extends ContentNodeLike> {
	readonly runKey: string;
	readonly first: N;
	readonly children: ReactNode;
}

/**
 * Consecutive siblings that belong together get one wrapper: list items
 * (paragraphs carrying `listStyleType`) become a `<ul>` or `<ol>`. `of`
 * names the run a node belongs to, or null for a node that stands alone.
 */
export interface ContentRunWrapper<N extends ContentNodeLike> {
	readonly of: (node: N) => string | null;
	readonly Render: ComponentType<ContentRunRenderProps<N>>;
	readonly toHtml: (runKey: string, inner: string, first: N) => string;
}

/** What a Markdown rule gets to work with, without naming Plate's own helpers. */
export interface ContentMarkdownContext {
	/** The node's children as mdast nodes. */
	readonly serializeChildren: (node: ContentNodeLike) => ReadonlyArray<unknown>;
	/** An mdast node's children as content nodes. */
	readonly deserializeChildren: (
		mdast: unknown,
	) => ReadonlyArray<ContentDescendant>;
}

/**
 * How a node kind crosses into Markdown. Plate's own rules cover the kinds
 * Markdown has words for; a kind of ours (a callout, an embed) declares how
 * it becomes an mdast node, MDX elements included, and how it comes back.
 */
export interface ContentMarkdownRule<N extends ContentNodeLike> {
	readonly serialize?: (node: N, context: ContentMarkdownContext) => unknown;
	readonly deserialize?: (mdast: never, context: ContentMarkdownContext) => N;
	/** The key Plate deserializes the mdast kind under, when it is not `type` (an mdast image is `img`). */
	readonly deserializeKey?: string;
	/** What Markdown cannot say about this node, for the reader of the export. */
	readonly loss?: string;
}

export interface ContentNodeReader<N extends ContentNodeLike> {
	readonly type: N["type"];
	/** Inline nodes (a link) flow inside text; blocks stack; voids carry no editable text. */
	readonly kind?: "block" | "inline" | "void";
	/** Blocks the indent and list machinery may act on (paragraph, headings, quote). */
	readonly indentable?: boolean;
	readonly Render: ComponentType<ContentRenderProps<N>>;
	readonly toHtml: (
		node: N,
		children: string,
		options: ContentHtmlOptions,
	) => string;
	readonly wrapRun?: ContentRunWrapper<N>;
	readonly markdown?: ContentMarkdownRule<N>;
	/** How the editor mints a fresh node of this kind. Absent for a kind that
	 * is never inserted on its own (a table row). */
	readonly createNode?: (init?: Partial<N>) => N;
}

/** A text mark: `bold` on a leaf becomes `<strong>` around it. */
export interface ContentLeafDecorator {
	readonly key: string;
	readonly Render: ComponentType<{ readonly children: ReactNode }>;
	readonly toHtml: (inner: string) => string;
}

/** A reader for a node kind the editor can mint on its own. */
export type ContentInsertableNodeReader<N extends ContentNodeLike> =
	ContentNodeReader<N> & Required<Pick<ContentNodeReader<N>, "createNode">>;

/**
 * A node reader whose node type has been forgotten. `ContentNodeReader<N>`
 * is invariant in `N` (`createNode` returns it, `Render` and `toHtml` take
 * it), so a heterogeneous array does not widen on its own. TypeScript cannot
 * write the existential this needs, so it is spelled `any`, once, here. What
 * keeps it honest at runtime is that a reader is only ever handed a node of
 * its own `type`, which the single registry lookup guarantees.
 */
// biome-ignore lint/suspicious/noExplicitAny: an existential type TypeScript cannot express; see above.
export type AnyContentNodeReader = ContentNodeReader<any>;

export interface ContentFeatureReader {
	/** Unique across a registry; also the key of the feature's label. */
	readonly key: string;
	readonly nodes?: ReadonlyArray<AnyContentNodeReader>;
	readonly leaves?: ReadonlyArray<ContentLeafDecorator>;
}

/** The node union a feature tuple can produce, from what its readers create. */
export type ContentNodeOf<
	Features extends ReadonlyArray<{
		readonly nodes?: ReadonlyArray<{
			readonly createNode?: (init?: never) => ContentNodeLike;
		}>;
	}>,
> =
	NonNullable<
		NonNullable<Features[number]["nodes"]>[number]["createNode"]
	> extends (init?: never) => infer N
		? N
		: never;
