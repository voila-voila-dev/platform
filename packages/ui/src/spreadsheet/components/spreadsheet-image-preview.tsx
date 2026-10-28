import { ImageIcon, SpinnerIcon } from "@phosphor-icons/react";

interface Props {
	src: string | null | undefined;
	alt: string;
	uploading: boolean;
}

/** Thumbnail, spinner or empty placeholder - whichever the cell's state calls for. */
export function SpreadsheetImagePreview({ src, alt, uploading }: Props) {
	if (uploading) {
		return (
			<SpinnerIcon
				aria-hidden="true"
				className="size-4 animate-spin text-muted-foreground"
			/>
		);
	}
	if (src === null || src === undefined || src.length === 0) {
		return (
			<ImageIcon
				aria-hidden="true"
				className="size-4 text-muted-foreground/50 group-hover/image-cell:text-muted-foreground"
			/>
		);
	}
	// `object-contain` over `cover`: catalogue shots are packshots on white,
	// cropping them to a 24px square would cut the product out of frame.
	return (
		<img
			src={src}
			alt={alt}
			className="size-6 rounded-sm object-contain"
			draggable={false}
		/>
	);
}
