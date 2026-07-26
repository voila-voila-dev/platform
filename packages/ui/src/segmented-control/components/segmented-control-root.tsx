import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import * as React from "react";
import type { VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";
import { segmentedControlVariants } from "#/segmented-control/components/segmented-control-variants.ts";
import { SegmentedControlContext } from "#/segmented-control/context/segmented-control-context.ts";

interface Props
	extends RadioGroupPrimitive.Props,
		VariantProps<typeof segmentedControlVariants> {}

export function SegmentedControlRoot({
	className,
	size = "default",
	children,
	onValueChange,
	...props
}: Props) {
	const rootRef = React.useRef<HTMLDivElement | null>(null);
	const thumbRef = React.useRef<HTMLSpanElement | null>(null);
	const hasMeasuredRef = React.useRef(false);
	// Re-rendering on uncontrolled selection changes keeps the layout effect
	// below in sync with Base UI's internal state (the parent component does
	// not re-render when only the primitive's state moves).
	const [, forceMeasure] = React.useReducer((count: number) => count + 1, 0);

	const measure = React.useCallback(() => {
		const root = rootRef.current;
		const thumb = thumbRef.current;
		if (!root || !thumb) {
			return;
		}
		const checked = root.querySelector<HTMLElement>(
			"[data-slot='segmented-control-item'][data-checked]",
		);
		if (!checked) {
			thumb.style.opacity = "0";
			return;
		}
		// Skip the slide-in animation on the very first paint - the thumb
		// should appear on the selected segment, not travel from the edge.
		const isFirstMeasure = !hasMeasuredRef.current;
		if (isFirstMeasure) {
			thumb.style.transitionDuration = "0s";
		}
		thumb.style.opacity = "1";
		thumb.style.width = `${checked.offsetWidth}px`;
		thumb.style.transform = `translateX(${checked.offsetLeft}px)`;
		if (isFirstMeasure) {
			hasMeasuredRef.current = true;
			requestAnimationFrame(() => {
				thumb.style.transitionDuration = "";
			});
		}
	}, []);

	React.useLayoutEffect(() => {
		measure();
	});

	React.useLayoutEffect(() => {
		const root = rootRef.current;
		if (!root || typeof ResizeObserver === "undefined") {
			return;
		}
		const observer = new ResizeObserver(measure);
		observer.observe(root);
		for (const item of root.querySelectorAll(
			"[data-slot='segmented-control-item']",
		)) {
			observer.observe(item);
		}
		return () => observer.disconnect();
	}, [measure]);

	return (
		<RadioGroupPrimitive
			ref={rootRef}
			data-slot="segmented-control"
			data-size={size}
			className={cn(segmentedControlVariants({ size }), className)}
			onValueChange={(value, eventDetails) => {
				onValueChange?.(value, eventDetails);
				forceMeasure();
			}}
			{...props}
		>
			<span
				ref={thumbRef}
				aria-hidden
				data-slot="segmented-control-thumb"
				className="absolute inset-y-[3px] left-0 -z-10 rounded-md border border-transparent bg-background opacity-0 shadow-sm transition-[transform,width] duration-200 ease-out group-data-[size=sm]/segmented-control:rounded-[min(var(--radius-sm),10px)] motion-reduce:transition-none dark:border-input dark:bg-input/30"
			/>
			<SegmentedControlContext.Provider value={{ size }}>
				{children}
			</SegmentedControlContext.Provider>
		</RadioGroupPrimitive>
	);
}
