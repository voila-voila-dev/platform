import type * as React from "react";
import { useCarousel } from "#/carousel/hooks/use-carousel.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function CarouselDots({ className, ...props }: Props) {
	const { orientation, scrollSnaps, selectedIndex, scrollTo } = useCarousel();

	return (
		<div
			data-slot="carousel-dots"
			data-orientation={orientation}
			className={cn(
				"flex items-center justify-center gap-2 pt-4 data-[orientation=vertical]:flex-col",
				className,
			)}
			{...props}
		>
			{scrollSnaps.map((_snap, index) => (
				<button
					key={index}
					type="button"
					data-slot="carousel-dot"
					data-state={index === selectedIndex ? "active" : "inactive"}
					aria-label={`Go to slide ${index + 1}`}
					aria-current={index === selectedIndex ? "true" : undefined}
					className="size-2.5 touch-manipulation rounded-full bg-border transition-colors hover:bg-muted-foreground/50 data-[state=active]:bg-primary"
					onClick={() => scrollTo(index)}
				/>
			))}
		</div>
	);
}
