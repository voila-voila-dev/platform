import { Link } from "@tanstack/react-router";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import { Preview } from "./preview";

/**
 * Sends internal root-absolute links through the router so navigation stays
 * client-side; anchors and external URLs render as plain <a>.
 */
function MdxLink({ href, children, ...props }: ComponentProps<"a">) {
	if (href?.startsWith("/")) {
		const [path, hash] = href.split("#");
		return (
			<Link to={(path ?? "/").replace(/\/$/, "") || "/"} hash={hash} {...props}>
				{children}
			</Link>
		);
	}
	return (
		<a href={href} {...props}>
			{children}
		</a>
	);
}

/** Tables scroll inside their own frame; the page never scrolls sideways. */
function MdxTable(props: ComponentProps<"table">) {
	return (
		<div className="overflow-x-auto">
			<table {...props} />
		</div>
	);
}

/**
 * `Preview` frames the live example at the top of all but a dozen of the 194
 * pages. Supplying it here rather than importing it per page removes 182
 * identical import lines and one more thing to get wrong when adding a page.
 *
 * `PropTable` deliberately does *not* belong here: `remarkPropTable` replaces
 * it with a real table during the MDX transform, so React never sees the tag.
 */
export const mdxComponents: MDXComponents = {
	a: MdxLink,
	table: MdxTable,
	Preview,
};
