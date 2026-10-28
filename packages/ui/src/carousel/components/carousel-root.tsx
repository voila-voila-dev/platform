import useEmblaCarousel from "embla-carousel-react";
import * as React from "react";
import {
	type CarouselApi,
	CarouselContext,
	type CarouselSettings,
} from "#/carousel/context/carousel-context.tsx";
import { cn } from "#/lib/utils.ts";

function prefersReducedMotion() {
	return (
		typeof window !== "undefined" &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches
	);
}

interface Props extends React.ComponentProps<"div">, CarouselSettings {}

export function CarouselRoot({
	orientation = "horizontal",
	opts,
	setApi,
	plugins,
	className,
	children,
	...props
}: Props) {
	const [carouselRef, api] = useEmblaCarousel(
		{
			...opts,
			axis: orientation === "horizontal" ? "x" : "y",
		},
		plugins,
	);
	const [canScrollPrev, setCanScrollPrev] = React.useState(false);
	const [canScrollNext, setCanScrollNext] = React.useState(false);
	const [selectedIndex, setSelectedIndex] = React.useState(0);
	const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

	const onSelect = React.useCallback((api: CarouselApi) => {
		if (!api) return;
		setCanScrollPrev(api.canScrollPrev());
		setCanScrollNext(api.canScrollNext());
		setSelectedIndex(api.selectedScrollSnap());
	}, []);

	const scrollPrev = React.useCallback(() => {
		api?.scrollPrev(prefersReducedMotion());
	}, [api]);

	const scrollNext = React.useCallback(() => {
		api?.scrollNext(prefersReducedMotion());
	}, [api]);

	const scrollTo = React.useCallback(
		(index: number) => {
			api?.scrollTo(index, prefersReducedMotion());
		},
		[api],
	);

	const handleKeyDown = React.useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			const previousKey =
				orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
			const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";

			if (event.key === previousKey) {
				event.preventDefault();
				scrollPrev();
			} else if (event.key === nextKey) {
				event.preventDefault();
				scrollNext();
			}
		},
		[orientation, scrollPrev, scrollNext],
	);

	React.useEffect(() => {
		if (!api || !setApi) return;
		setApi(api);
	}, [api, setApi]);

	React.useEffect(() => {
		if (!api) return;
		const onReInit = (api: CarouselApi) => {
			if (!api) return;
			setScrollSnaps(api.scrollSnapList());
			onSelect(api);
		};
		setScrollSnaps(api.scrollSnapList());
		onSelect(api);
		api.on("reInit", onReInit);
		api.on("select", onSelect);

		return () => {
			api.off("reInit", onReInit);
			api.off("select", onSelect);
		};
	}, [api, onSelect]);

	return (
		<CarouselContext.Provider
			value={{
				carouselRef,
				api,
				opts,
				orientation,
				scrollPrev,
				scrollNext,
				scrollTo,
				canScrollPrev,
				canScrollNext,
				selectedIndex,
				scrollSnaps,
			}}
		>
			<div
				onKeyDownCapture={handleKeyDown}
				className={cn("relative", className)}
				role="region"
				aria-roledescription="carousel"
				data-slot="carousel"
				data-orientation={orientation}
				{...props}
			>
				{children}
			</div>
		</CarouselContext.Provider>
	);
}
