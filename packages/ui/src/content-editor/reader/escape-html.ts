export function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

/** `id="…"` when the node carries an id, otherwise nothing. */
export function idAttribute(id: string | undefined): string {
	return id === undefined ? "" : ` id="${escapeHtml(id)}"`;
}

/** ` class="…"` when a host names classes for this node type. */
export function classAttribute(className: string | undefined): string {
	return className === undefined ? "" : ` class="${escapeHtml(className)}"`;
}

/** The class a reader renders by default, unless the host names its own or asks for none. */
export function kitClassName(
	options: {
		readonly classNameFor?: (type: string) => string | undefined;
		readonly unstyled?: boolean;
	},
	type: string,
	fallback: string,
): string | undefined {
	return (
		options.classNameFor?.(type) ?? (options.unstyled ? undefined : fallback)
	);
}

const SAFE_SCHEMES = new Set(["http", "https", "mailto", "tel"]);

/**
 * A URL ready for an `href` or a `src`, `#` in place of a scheme that runs
 * code (`javascript:`, `vbscript:`, a `data:` that is not an image). The
 * tabs and newlines are dropped first because a browser drops them too
 * before reading the scheme.
 */
export function escapeUrl(url: string): string {
	const readable = url.replace(/[\t\n\r]/g, "");
	let start = 0;
	while (start < readable.length && readable.charCodeAt(start) <= 32) {
		start += 1;
	}
	const target = readable.slice(start);
	const scheme = /^([a-z][a-z\d+.-]*):/i.exec(target)?.[1]?.toLowerCase();
	const safe =
		scheme === undefined ||
		SAFE_SCHEMES.has(scheme) ||
		/^data:image\//i.test(target);
	return escapeHtml(safe ? url : "#");
}
