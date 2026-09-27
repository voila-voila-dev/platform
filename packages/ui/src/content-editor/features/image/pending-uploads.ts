/**
 * The files a drop or a paste brought for image nodes not on the canvas yet.
 * Each node's element takes its file when it mounts and runs the upload
 * itself, so a dropped image shows the same progress and the same failure as
 * a picked one. Keyed by node id, since Slate copies a node as it inserts it.
 */
const pending = new Map<string, File>();

export function queueImageUpload(nodeId: string, file: File): void {
	pending.set(nodeId, file);
}

export function takeImageUpload(nodeId: string): File | undefined {
	const file = pending.get(nodeId);
	pending.delete(nodeId);
	return file;
}
