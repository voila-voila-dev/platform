import { CarouselContent } from "#/carousel/components/carousel-content.tsx";
import { CarouselDots } from "#/carousel/components/carousel-dots.tsx";
import { CarouselItem } from "#/carousel/components/carousel-item.tsx";
import { CarouselNext } from "#/carousel/components/carousel-next.tsx";
import { CarouselPrevious } from "#/carousel/components/carousel-previous.tsx";
import { CarouselRoot } from "#/carousel/components/carousel-root.tsx";

/**
 * The Carousel parts as one namespace.
 */
export const Carousel = {
	Root: CarouselRoot,
	Content: CarouselContent,
	Dots: CarouselDots,
	Item: CarouselItem,
	Next: CarouselNext,
	Previous: CarouselPrevious,
};
