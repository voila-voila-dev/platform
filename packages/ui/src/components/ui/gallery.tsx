import { ImageIcon } from "@phosphor-icons/react";
import * as React from "react";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "#/components/ui/carousel.tsx";
import { Dialog, DialogContent, DialogTitle } from "#/components/ui/dialog.tsx";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "#/components/ui/empty.tsx";
import { cn } from "#/lib/utils.ts";

type GalleryImage = { src: string; alt?: string };

/**
 * Full-screen image viewer built on Dialog + Carousel. Controlled via `open`
 * / `onOpenChange`; `startIndex` selects which image is shown first. Swipe or
 * use the prev/next controls (embla handles touch on mobile).
 */
function Lightbox({
	images,
	open,
	onOpenChange,
	startIndex = 0,
}: {
	images: ReadonlyArray<GalleryImage>;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	startIndex?: number;
}) {
	const [api, setApi] = React.useState<CarouselApi>();

	// Jump to the requested slide whenever the lightbox (re)opens.
	React.useEffect(() => {
		if (open && api) api.scrollTo(startIndex, true);
	}, [open, api, startIndex]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				size="xl"
				closeButtonLabel="Close gallery"
				// The width override repeats the `data-[size=xl]` variant so it beats
				// the size recipe's own `data-[size=xl]:sm:max-w-xl`.
				className="bg-background p-2 data-[size=xl]:sm:max-w-3xl"
			>
				<DialogTitle className="sr-only">Image gallery</DialogTitle>
				<Carousel
					setApi={setApi}
					opts={{ startIndex, loop: images.length > 1 }}
					data-slot="lightbox-carousel"
					className="w-full"
				>
					<CarouselContent>
						{images.map((image, index) => (
							<CarouselItem key={image.src ?? index}>
								<div className="flex items-center justify-center">
									<img
										src={image.src}
										alt={image.alt ?? ""}
										data-slot="lightbox-image"
										className="max-h-[80dvh] w-auto rounded-lg object-contain"
									/>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					{images.length > 1 ? (
						<>
							<CarouselPrevious inset />
							<CarouselNext inset />
						</>
					) : null}
				</Carousel>
			</DialogContent>
		</Dialog>
	);
}

/**
 * Responsive thumbnail grid that opens a full-screen `Lightbox` on click.
 * Renders an `Empty` state when there are no images. Thumbnails are buttons so
 * they're keyboard-navigable; the lightbox itself is swipeable on mobile.
 */
function Gallery({
	images,
	emptyLabel = "No photos yet",
	emptyDescription,
	className,
	...props
}: Omit<React.ComponentProps<"div">, "children"> & {
	images: ReadonlyArray<GalleryImage>;
	emptyLabel?: React.ReactNode;
	emptyDescription?: React.ReactNode;
}) {
	const [openIndex, setOpenIndex] = React.useState<number | null>(null);

	if (images.length === 0) {
		return (
			<Empty bordered className={className} {...props}>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<ImageIcon />
					</EmptyMedia>
					<EmptyTitle>{emptyLabel}</EmptyTitle>
					{emptyDescription ? (
						<EmptyDescription>{emptyDescription}</EmptyDescription>
					) : null}
				</EmptyHeader>
			</Empty>
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
			<Lightbox
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

export { Gallery, type GalleryImage, Lightbox };
