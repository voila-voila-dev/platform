import { ImageIcon } from "@phosphor-icons/react";
import * as React from "react";
import { Empty } from "#/empty/components/empty.tsx";
import { GalleryLightbox } from "#/gallery/components/gallery-lightbox.tsx";
import type { GalleryImage } from "#/gallery/lib/gallery-types.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends Omit<React.ComponentProps<"div">, "children"> {
	images: ReadonlyArray<GalleryImage>;
	emptyLabel?: React.ReactNode;
	emptyDescription?: React.ReactNode;
}

/**
 * Responsive thumbnail grid that opens a full-screen `Lightbox` on click.
 * Renders an `Empty` state when there are no images. Thumbnails are buttons so
 * they're keyboard-navigable; the lightbox itself is swipeable on mobile.
 */
export function GalleryRoot({
	images,
	emptyLabel = "No photos yet",
	emptyDescription,
	className,
	...props
}: Props) {
	const [openIndex, setOpenIndex] = React.useState<number | null>(null);

	if (images.length === 0) {
		return (
			<Empty.Root bordered className={className} {...props}>
				<Empty.Header>
					<Empty.Media variant="icon">
						<ImageIcon />
					</Empty.Media>
					<Empty.Title>{emptyLabel}</Empty.Title>
					{emptyDescription ? (
						<Empty.Description>{emptyDescription}</Empty.Description>
					) : null}
				</Empty.Header>
			</Empty.Root>
		);
	}

	return (
		<div data-slot="gallery" className={className} {...props}>
			<div
				data-slot="gallery-grid"
				className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4"
			>
				{images.map((image, index) => (
					<button
						key={image.src ?? index}
						type="button"
						data-slot="gallery-thumbnail"
						aria-label={image.alt ?? `Open image ${index + 1}`}
						className="group/thumb relative aspect-square touch-manipulation overflow-hidden rounded-lg bg-muted outline-none ring-1 ring-foreground/10 transition focus-visible:ring-2 focus-visible:ring-ring/50"
						onClick={() => setOpenIndex(index)}
					>
						<img
							src={image.src}
							alt={image.alt ?? ""}
							loading="lazy"
							className={cn(
								"size-full object-cover transition-transform duration-200",
								"group-hover/thumb:scale-105",
							)}
						/>
					</button>
				))}
			</div>
			<GalleryLightbox
				images={images}
				open={openIndex !== null}
				startIndex={openIndex ?? 0}
				onOpenChange={(next) => {
					if (!next) setOpenIndex(null);
				}}
			/>
		</div>
	);
}
