import type {
	ContentEditorApi,
	ContentFileHandler,
	ContentItemContext,
} from "#/content-editor/features/feature-definition.tsx";

/** The files a drop or a paste carries, or none when it carries text only. */
export function filesOf(transfer: DataTransfer | null): ReadonlyArray<File> {
	if (transfer === null) {
		return [];
	}
	return Array.from(transfer.files ?? []);
}

/**
 * Routes each file to the first handler that accepts it, grouping files per
 * handler so one drop of three images makes one insertion. Returns whether
 * any file found a home, so the caller knows to swallow the event.
 */
export function dispatchFiles(
	editor: ContentEditorApi,
	files: ReadonlyArray<File>,
	handlers: ReadonlyArray<ContentFileHandler>,
	context: ContentItemContext,
): boolean {
	const grouped = new Map<ContentFileHandler, File[]>();
	for (const file of files) {
		const handler = handlers.find((candidate) => candidate.accepts(file));
		if (handler !== undefined) {
			grouped.set(handler, [...(grouped.get(handler) ?? []), file]);
		}
	}
	for (const [handler, accepted] of grouped) {
		handler.insert(editor, accepted, context);
	}
	return grouped.size > 0;
}
