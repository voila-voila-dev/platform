import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import useEmblaCarousel, {
	type UseEmblaCarouselType,
} from "embla-carousel-react";
import * as React from "react";
import { Button } from "#/components/ui/button.tsx";
import { cn } from "#/lib/utils.ts";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
	opts?: CarouselOptions;
	plugins?: CarouselPlugin;
	orientation?: "horizontal" | "vertical";
	setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
	carouselRef: ReturnType<typeof useEmblaCarousel>[0];
	api: ReturnType<typeof useEmblaCarousel>[1];
	scrollPrev: () => void;
	scrollNext: () => void;
	scrollTo: (index: number) => void;
	canScrollPrev: boolean;
	canScrollNext: boolean;
	selectedIndex: number;
	scrollSnaps: number[];
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
	const context = React.useContext(CarouselContext);

	if (!context) {
		throw new Error("useCarousel must be used within a <Carousel />");
	}

	return context;
}

function prefersReducedMotion() {
	return (
		typeof window !== "undefined" &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches
	);
}

function Carousel({
	orientation = "horizontal",
	opts,
	setApi,
	plugins,
	className,
	children,
	...props
}: React.ComponentProps<"div"> & CarouselProps) {
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

function CarouselContent({
	className,
	containerClassName,
	...props
}: React.ComponentProps<"div"> & { containerClassName?: string }) {
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

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
	const { orientation } = useCarousel();

	return (
		<div
			role="group"
			aria-roledescription="slide"
			data-slot="carousel-item"
			data-orientation={orientation}
			className={cn(
				"min-w-0 shrink-0 grow-0 basis-full data-[orientation=horizontal]:pl-4 data-[orientation=vertical]:pt-4",
				className,
			)}
			{...props}
		/>
	);
}

function CarouselPrevious({
	className,
	variant = "outline",
	size = "icon-sm",
	inset = false,
	...props
}: React.ComponentProps<typeof Button> & { inset?: boolean }) {
	const { orientation, scrollPrev, canScrollPrev } = useCarousel();

	return (
		<Button
			data-slot="carousel-previous"
			data-orientation={orientation}
			variant={variant}
			size={size}
			className={cn(
				"absolute touch-manipulation rounded-full dark:border-foreground/25 dark:bg-background",
				"data-[orientation=horizontal]:top-1/2 data-[orientation=horizontal]:-translate-y-1/2",
				"data-[orientation=vertical]:left-1/2 data-[orientation=vertical]:-translate-x-1/2 data-[orientation=vertical]:rotate-90",
				inset
					? "data-[orientation=horizontal]:left-2 data-[orientation=vertical]:top-2"
					: "data-[orientation=horizontal]:-left-12 data-[orientation=vertical]:-top-12",
				className,
			)}
			disabled={!canScrollPrev}
			onClick={scrollPrev}
			{...props}
		>
			<CaretLeftIcon />
			<span className="sr-only">Previous slide</span>
		</Button>
	);
}

function CarouselNext({
	className,
	variant = "outline",
	size = "icon-sm",
	inset = false,
	...props
}: React.ComponentProps<typeof Button> & { inset?: boolean }) {
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

function CarouselDots({ className, ...props }: React.ComponentProps<"div">) {
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

export {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselDots,
	CarouselItem,
	CarouselNext,
	type CarouselOptions,
	type CarouselPlugin,
	CarouselPrevious,
	useCarousel,
};
