/**
 * Every element carries an id: React keys on the canvas and anchor ids in
 * the rendered HTML. `crypto.randomUUID` is everywhere the editor runs; the
 * fallback exists for a test runtime without it.
 */
export function newContentNodeId(): string {
	return typeof crypto !== "undefined" && "randomUUID" in crypto
		? crypto.randomUUID()
		: `node-${Math.random().toString(36).slice(2)}`;
}
