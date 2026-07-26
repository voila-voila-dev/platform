import { ImageIcon } from "@phosphor-icons/react";
import type { EmailEditorCardImage } from "#/email-block-editor/document/types.ts";
import { EMAIL_COLOR } from "#/email-block-editor/theme.ts";

interface Props {
	image: EmailEditorCardImage;
}

/** The image slot of a card block, with its rounded top corners. */
export function EmailCardImage({ image }: Props) {
	if (image.src === "") {
		return (
			<div
				className="flex h-28 items-center justify-center"
				style={{
					backgroundColor: EMAIL_COLOR.canvas,
					color: EMAIL_COLOR.muted,
				}}
			>
				<ImageIcon size={24} aria-hidden />
			</div>
		);
	}
	return <img src={image.src} alt={image.alt} className="block w-full" />;
}
