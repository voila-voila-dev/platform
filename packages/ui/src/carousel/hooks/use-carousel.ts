import * as React from "react";
import { CarouselContext } from "#/carousel/context/carousel-context.tsx";

export function useCarousel() {
	const context = React.useContext(CarouselContext);

	if (!context) {
		throw new Error("useCarousel must be used within a <Carousel.Root />");
	}

	return context;
}
