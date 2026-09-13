import { ImageIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import {
	PlateElement,
	type PlateElementProps,
	useEditorRef,
} from "platejs/react";
import { useRef, useState } from "react";
import { Button } from "#/button/components/button.tsx";
import { VoidCaption } from "#/content-editor/components/void-caption.tsx";
import {
	VoidEmpty,
	VoidFrame,
} from "#/content-editor/components/void-frame.tsx";
import { useContentEditorConfig } from "#/content-editor/context/content-editor-context.tsx";
import type { ContentImageNode } from "#/content-editor/features/image/reader.tsx";

/**
 * An image on the canvas. Without a url it is a drop zone that opens the
 * file picker; the upload is the host's, through `onUploadImage`, and its
 * result lands on the node. A failure keeps the node and says why.
 */
export function ImageElement(props: PlateElementProps) {
	const editor = useEditorRef();
	const { labels, uploadImage } = useContentEditorConfig();
	const node = props.element as unknown as ContentImageNode;
	const fileInput = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [failure, setFailure] = useState<string | null>(null);

	const upload = async (file: File) => {
		if (uploadImage === null) {
			return;
		}
		setFailure(null);
		setUploading(true);
		try {
			const uploaded = await uploadImage(file);
			const path = editor.api.findPath(props.element);
			if (path !== undefined) {
				editor.tf.setNodes(
					{
						url: uploaded.url,
						width: uploaded.width,
						height: uploaded.height,
					} as never,
					{ at: path },
				);
			}
		} catch (error) {
			setFailure(error instanceof Error ? error.message : String(error));
		} finally {
			setUploading(false);
		}
	};

	const picker = (
		<input
			ref={fileInput}
			type="file"
			accept="image/*"
			className="hidden"
			disabled={uploading || uploadImage === null}
			onChange={(event) => {
				const file = event.target.files?.[0];
				event.target.value = "";
				if (file) {
					void upload(file);
				}
			}}
		/>
	);

	return (
		<PlateElement {...props}>
			<VoidFrame>
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
						<Button
							type="button"
							variant="ghost"
							size="sm"
							disabled={uploading || uploadImage === null}
							onClick={() => fileInput.current?.click()}
						>
							<ImageIcon aria-hidden />
							{uploading
								? labels.chrome.uploading
								: uploadImage === null
									? labels.chrome.uploadDisabled
									: labels.chrome.pickImage}
						</Button>
					</VoidEmpty>
				)}
				{picker}
				{failure !== null ? (
					<p className="text-destructive text-xs">
						{labels.chrome.uploadFailed(failure)}
					</p>
				) : null}
				<div className="flex items-center justify-between gap-2">
					<VoidCaption element={node} caption={node.caption} />
					{node.url && uploadImage !== null ? (
						<Button
							type="button"
							variant="ghost"
							size="xs"
							disabled={uploading}
							onClick={() => fileInput.current?.click()}
						>
							<UploadSimpleIcon aria-hidden />
							{labels.chrome.edit}
						</Button>
					) : null}
				</div>
			</VoidFrame>
			{props.children}
		</PlateElement>
	);
}
