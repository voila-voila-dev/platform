import * as React from "react";

import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"table"> {
	containerClassName?: string;
}

/**
 * Mirrors where the container stands in its horizontal scroll as
 * `data-scrolled-start` / `data-scrolled-end` attributes, so styles that only
 * make sense while content is actually cut off — a pinned column's shadow, an
 * edge fade — can key on them without every consumer wiring its own listener.
 * Attributes rather than state: scrolling must never re-render the table.
 */
function useScrollEdgeAttributes(): React.RefObject<HTMLDivElement | null> {
	const ref = React.useRef<HTMLDivElement>(null);
	React.useEffect(() => {
		const container = ref.current;
		if (container === null) {
			return;
		}
		const update = () => {
			// `Math.abs`: in RTL writing modes `scrollLeft` runs negative.
			const scrolled = Math.abs(container.scrollLeft);
			container.toggleAttribute("data-scrolled-start", scrolled > 0);
			container.toggleAttribute(
				"data-scrolled-end",
				// The -1 forgives the sub-pixel remainder of a zoomed viewport.
				scrolled + container.clientWidth < container.scrollWidth - 1,
			);
		};
		update();
		container.addEventListener("scroll", update, { passive: true });
		// Both boxes matter: the container resizing changes what fits, the table
		// resizing (a column drag, new rows) changes what there is to fit.
		// Guarded: test DOMs ship without `ResizeObserver`, and scrolling alone
		// still keeps the attributes fresh there.
		const observer =
			typeof ResizeObserver === "undefined"
				? undefined
				: new ResizeObserver(update);
		observer?.observe(container);
		if (observer !== undefined && container.firstElementChild !== null) {
			observer.observe(container.firstElementChild);
		}
		return () => {
			container.removeEventListener("scroll", update);
			observer?.disconnect();
		};
	}, []);
	return ref;
}

export function TableRoot({ className, containerClassName, ...props }: Props) {
	const containerRef = useScrollEdgeAttributes();
	return (
		<div
			ref={containerRef}
			data-slot="table-container"
			className={cn("relative w-full overflow-x-auto", containerClassName)}
		>
			<table
				data-slot="table"
				className={cn("w-full caption-bottom text-sm", className)}
				{...props}
			/>
		</div>
	);
}
