import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type {
	ContentFeatureReader,
	ContentInsertableNodeReader,
} from "#/content-editor/features/reader-definition.tsx";
import { newContentNodeId } from "#/content-editor/lib/ids.ts";
import {
	classAttribute,
	escapeHtml,
	kitClassName,
} from "#/content-editor/reader/escape-html.ts";

export interface ContentLinkNode extends ContentNodeLike {
	readonly type: "a";
	readonly id?: string;
	readonly url: string;
	readonly title?: string;
	/** `_blank` when the link was pasted or imported opening a new tab. */
	readonly target?: string;
}

const SCHEME = /^[a-z][a-z\d+.-]*:/i;

/** `URL.parse` without it: Safari 17 lacks it. */
function parseUrl(url: string): URL | null {
	try {
		return new URL(url, "https://relative.invalid");
	} catch {
		return null;
	}
}

/**
 * Another site, or a new tab: the page it opens gets neither a handle on
 * this one nor its address. A relative link, or one to `siteOrigin`, is
 * navigation within the site and keeps its referrer.
 */
export function isExternalLink(
	link: Pick<ContentLinkNode, "url" | "target">,
	siteOrigin?: string,
): boolean {
	if (link.target === "_blank") {
		return true;
	}
	const url = link.url.trim();
	if (!SCHEME.test(url) && !url.startsWith("//")) {
		return false;
	}
	const parsed = parseUrl(url);
	if (parsed === null || !["http:", "https:"].includes(parsed.protocol)) {
		return false;
	}
	return (
		siteOrigin === undefined || parsed.origin !== new URL(siteOrigin).origin
	);
}

export const linkNode: ContentInsertableNodeReader<ContentLinkNode> = {
	type: "a",
	kind: "inline",
	createNode: (init) => ({
		id: newContentNodeId(),
		type: "a",
		url: "",
		children: [{ text: "" }],
		...init,
	}),
	Render: ({ node, children, options }) => (
		<a
			href={node.url}
			title={node.title}
			target={node.target}
			rel={
				isExternalLink(node, options.siteOrigin)
					? "noopener noreferrer"
					: undefined
			}
			className={kitClassName(
				options,
				"a",
				"text-primary underline underline-offset-2",
			)}
		>
			{children}
		</a>
	),
	toHtml: (node, children, options) =>
		`<a href="${escapeHtml(node.url)}"${node.title ? ` title="${escapeHtml(node.title)}"` : ""}${node.target ? ` target="${escapeHtml(node.target)}"` : ""}${isExternalLink(node, options.siteOrigin) ? ' rel="noopener noreferrer"' : ""}${classAttribute(options.classNameFor?.("a"))}>${children}</a>`,
};

export const linkReader = {
	key: "link",
	nodes: [linkNode],
} satisfies ContentFeatureReader;
