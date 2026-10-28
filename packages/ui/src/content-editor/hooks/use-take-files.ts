import { useEditorRef } from "platejs/react";
import { useContentEditorConfig } from "#/content-editor/context/content-editor-context.tsx";
import { dispatchFiles, filesOf } from "#/content-editor/lib/files.ts";

/**
 * Takes the files a drop or a paste carries: what a feature accepts goes into
 * the document, the rest to the host's `onDropFiles`, or nowhere without one.
 * Returns whether the transfer carried files at all, so the caller keeps them
 * from the browser and from Plate, which would try to resolve a range under a
 * file.
 */
export function useTakeFiles(): (transfer: DataTransfer | null) => boolean {
	const editor = useEditorRef();
	const { registry, capabilities, labels, uploadImage, dropFiles, readOnly } =
		useContentEditorConfig();
	return (transfer) => {
		const files = filesOf(transfer);
		if (files.length === 0) {
			return false;
		}
		if (readOnly) {
			return true;
		}
		const unclaimed = dispatchFiles(
			editor,
			files,
			registry.fileHandlers(capabilities),
			{ labels, uploadImage },
		);
		if (unclaimed.length > 0 && dropFiles !== null) {
			dropFiles(unclaimed);
		}
		return true;
	};
}
