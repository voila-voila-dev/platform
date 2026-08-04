import { ImageIcon } from "@phosphor-icons/react";
import { useEmailEditorTheme } from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorCardImage } from "#/email-block-editor/document/types.ts";

interface Props {
	image: EmailEditorCardImage;
}

/** The image slot of a card block, with its rounded top corners. */
export function EmailCardImage({ image }: Props) {
	const theme = useEmailEditorTheme();
	if (image.src === "") {
		return (
			<div
				className="flex h-28 items-center justify-center"
				style={{
					backgroundColor: theme.color.canvas,
					color: theme.color.muted,
				}}
			>
				<ImageIcon size={24} aria-hidden />
			</div>
		);
	}
	return <img src={image.src} alt={image.alt} className="block w-full" />;
}
