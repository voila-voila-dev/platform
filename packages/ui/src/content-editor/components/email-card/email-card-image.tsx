import { ImageIcon } from "@phosphor-icons/react";
import { useContentEditorTheme } from "#/content-editor/context/theme-context.ts";
import type { ContentCardImage } from "#/content-editor/features/field-definition.ts";

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
