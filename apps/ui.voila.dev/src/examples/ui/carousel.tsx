import { Carousel } from "@voila.dev/ui/carousel";

export function CarouselExample() {
	return (
		<div className="mx-12 w-full max-w-xs">
			<Carousel.Root opts={{ loop: true }}>
				<Carousel.Content>
					{[1, 2, 3, 4, 5].map((slide) => (
						<Carousel.Item key={slide}>
							<div className="flex aspect-square items-center justify-center rounded-xl bg-muted font-semibold text-4xl">
								{slide}
							</div>
						</Carousel.Item>
					))}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
				<Carousel.Dots />
			</Carousel.Root>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Layout                                                                     */
/* -------------------------------------------------------------------------- */
