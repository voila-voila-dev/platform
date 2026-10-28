import type * as React from "react";
import { useCarousel } from "#/carousel/hooks/use-carousel.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	containerClassName?: string;
}

export function CarouselContent({
	className,
	containerClassName,
	...props
}: Props) {
	const { carouselRef, orientation } = useCarousel();

	return (
		<div
			ref={carouselRef}
			className={cn("overflow-hidden", containerClassName)}
			data-slot="carousel-content"
			data-orientation={orientation}
		>
			<div
				className={cn(
					"flex data-[orientation=horizontal]:-ml-4 data-[orientation=vertical]:-mt-4 data-[orientation=vertical]:flex-col",
					className,
				)}
				data-slot="carousel-track"
				data-orientation={orientation}
				{...props}
			/>
		</div>
	);
}
