import { ImageIcon } from "@phosphor-icons/react";
import { useEditorRef } from "platejs/react";
import { useEffect, useState } from "react";
import { PlayOverlay } from "#/content-editor/components/email-card/play-overlay.tsx";
import { VoidEmpty } from "#/content-editor/components/void-frame.tsx";
import { useContentEditorConfig } from "#/content-editor/context/content-editor-context.tsx";
import { useContentEditorTheme } from "#/content-editor/context/theme-context.ts";
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
	const theme = useContentEditorTheme();
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
		// The email block editor's image view: the theme's share of the width
		// (the caption follows it), and the play badge over a video thumbnail.
		<div
			className="mx-auto flex flex-col gap-1"
			style={{
				width: `${theme.imageWidthRatio[node.size ?? "full"] * 100}%`,
			}}
		>
			{node.url ? (
				<div className="relative">
					<img
						src={node.url}
						alt={node.alt ?? node.caption ?? ""}
						width={node.width}
						height={node.height}
						className="h-auto w-full rounded-xl border border-border bg-muted"
					/>
					{node.overlay === "play" ? <PlayOverlay /> : null}
				</div>
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
		</div>
	);
}
