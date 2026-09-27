import { ImageIcon } from "@phosphor-icons/react";
import { useContentEditorTheme } from "#/content-editor/context/theme-context.ts";

/** The visual of a card. An empty `src` means the card has none yet. */
export interface ContentCardImage {
	readonly src: string;
	readonly alt: string;
}

interface Props {
	image: ContentCardImage;
}

/** The image slot of a card block, with its rounded top corners. */
export function EmailCardImage({ image }: Props) {
	const theme = useContentEditorTheme();
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
