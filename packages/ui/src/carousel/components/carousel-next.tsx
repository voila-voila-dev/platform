import { CaretRightIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { Button } from "#/button/components/button.tsx";
import { useCarousel } from "#/carousel/hooks/use-carousel.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof Button> {
	inset?: boolean;
}

export function CarouselNext({
	className,
	variant = "outline",
	size = "icon-sm",
	inset = false,
	...props
}: Props) {
	const { orientation, scrollNext, canScrollNext } = useCarousel();

	return (
		<Button
			data-slot="carousel-next"
			data-orientation={orientation}
			variant={variant}
			size={size}
			className={cn(
				"absolute touch-manipulation rounded-full dark:border-foreground/25 dark:bg-background",
				"data-[orientation=horizontal]:top-1/2 data-[orientation=horizontal]:-translate-y-1/2",
				"data-[orientation=vertical]:left-1/2 data-[orientation=vertical]:-translate-x-1/2 data-[orientation=vertical]:rotate-90",
				inset
					? "data-[orientation=horizontal]:right-2 data-[orientation=vertical]:bottom-2"
					: "data-[orientation=horizontal]:-right-12 data-[orientation=vertical]:-bottom-12",
				className,
			)}
			disabled={!canScrollNext}
			onClick={scrollNext}
			{...props}
		>
			<CaretRightIcon />
			<span className="sr-only">Next slide</span>
		</Button>
	);
}
