import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { useCarousel } from "#/carousel/hooks/use-carousel.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

export function CarouselItem({ className, render, ...props }: Props) {
	const { orientation } = useCarousel();

	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				role: "group",
				"aria-roledescription": "slide",
				className: cn(
					"min-w-0 shrink-0 grow-0 basis-full data-[orientation=horizontal]:pl-4 data-[orientation=vertical]:pt-4",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "carousel-item", orientation },
	});
}
