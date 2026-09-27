import { ImageIcon } from "@phosphor-icons/react";
import { useEditorRef } from "platejs/react";
import { useEffect, useState } from "react";
import { VoidEmpty } from "#/content-editor/components/void-frame.tsx";
import { useContentEditorConfig } from "#/content-editor/context/content-editor-context.tsx";
import { takeImageUpload } from "#/content-editor/features/image/pending-uploads.ts";
import type { ContentImageNode } from "#/content-editor/features/image/reader.tsx";
import type { ContentElementViewProps } from "#/content-editor/lib/define-element-feature.ts";

/**
 * The image as the reader will see it, or a placeholder until it has one.
 * A file dropped or pasted into the document is uploaded here once its node
 * mounts, so the placeholder shows its progress and its failure; a picked
 * file goes through the inspector's file field instead.
 */
export function ImageView({ node }: ContentElementViewProps<ContentImageNode>) {
	const editor = useEditorRef();
	const { labels, uploadImage } = useContentEditorConfig();
	const [uploading, setUploading] = useState(false);
	const [failure, setFailure] = useState<string | null>(null);

	useEffect(() => {
		const dropped =
			node.id === undefined ? undefined : takeImageUpload(node.id);
		if (dropped === undefined || uploadImage === null) {
			return;
		}
		setUploading(true);
		uploadImage(dropped)
			.then((uploaded) => {
				// Found again by id: the element may have been replaced while the
				// upload ran, a caption typed or the document normalised.
				const entry = editor.api.node({ at: [], match: { id: node.id } });
				if (entry !== undefined) {
					editor.tf.setNodes(
						{
							url: uploaded.url,
							width: uploaded.width,
							height: uploaded.height,
						} as never,
						{ at: entry[1] },
					);
				}
			})
			.catch((error: unknown) =>
				setFailure(error instanceof Error ? error.message : String(error)),
			)
			.finally(() => setUploading(false));
	}, [editor, node.id, uploadImage]);

	return (
		<>
			{node.url ? (
				<img
					src={node.url}
					alt={node.alt ?? node.caption ?? ""}
					width={node.width}
					height={node.height}
					className="h-auto w-full rounded-xl border border-border bg-muted"
				/>
			) : (
				<VoidEmpty>
					<ImageIcon aria-hidden />
					{uploading ? labels.chrome.uploading : labels.chrome.imageEmpty}
				</VoidEmpty>
			)}
			{failure === null ? null : (
				<p className="text-destructive text-xs">
					{labels.chrome.uploadFailed(failure)}
				</p>
			)}
			{node.caption ? (
				<figcaption className="text-muted-foreground text-xs italic">
					{node.caption}
				</figcaption>
			) : null}
		</>
	);
}
