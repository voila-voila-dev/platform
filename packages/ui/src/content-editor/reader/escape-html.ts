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
