import * as React from "react";
import { Carousel } from "#/carousel/components/carousel.tsx";
import type { CarouselApi } from "#/carousel/context/carousel-context.tsx";
import { Dialog } from "#/dialog/components/dialog.tsx";
import type { GalleryImage } from "#/gallery/lib/gallery-types.ts";

interface Props extends React.ComponentProps<typeof Dialog.Root> {
	images: ReadonlyArray<GalleryImage>;
	startIndex?: number;
}

/**
 * Full-screen image viewer built on Dialog + Carousel. Controlled via `open`
 * / `onOpenChange`; `startIndex` selects which image is shown first. Swipe or
 * use the prev/next controls (embla handles touch on mobile).
 */
export function GalleryLightbox({
	images,
	open,
	onOpenChange,
	startIndex = 0,
	...props
}: Props) {
	const [api, setApi] = React.useState<CarouselApi>();

	// Jump to the requested slide whenever the lightbox (re)opens.
	React.useEffect(() => {
		if (open && api) api.scrollTo(startIndex, true);
	}, [open, api, startIndex]);

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange} {...props}>
			<Dialog.Content
				size="xl"
				closeButtonLabel="Close gallery"
				// The width override repeats the `data-[size=xl]` variant so it beats
				// the size recipe's own `data-[size=xl]:sm:max-w-xl`.
				className="bg-background p-2 data-[size=xl]:sm:max-w-3xl"
			>
				<Dialog.Title className="sr-only">Image gallery</Dialog.Title>
				<Carousel.Root
					setApi={setApi}
					opts={{ startIndex, loop: images.length > 1 }}
					data-slot="lightbox-carousel"
					className="w-full"
				>
					<Carousel.Content>
						{images.map((image, index) => (
							<Carousel.Item key={image.src ?? index}>
								<div className="flex items-center justify-center">
									<img
										src={image.src}
										alt={image.alt ?? ""}
										data-slot="lightbox-image"
										className="max-h-[80dvh] w-auto rounded-lg object-contain"
									/>
								</div>
							</Carousel.Item>
						))}
					</Carousel.Content>
					{images.length > 1 ? (
						<>
							<Carousel.Previous inset />
							<Carousel.Next inset />
						</>
					) : null}
				</Carousel.Root>
			</Dialog.Content>
		</Dialog.Root>
	);
}
