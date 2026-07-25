import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import * as React from "react";
import { cva, type VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";

/**
 * Single-select switcher (Day/Week/Month) with an animated selection thumb.
 * Built on radio semantics - exactly one segment is always selected - which
 * is what separates it from `ToggleGroup`'s pressable toolbar buttons.
 */
const segmentedControlVariants = cva({
	base: "group/segmented-control relative isolate inline-flex w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground",
	variants: {
		size: {
			default: "h-8",
			sm: "h-7 rounded-[min(var(--radius-md),12px)]",
			lg: "h-9",
		},
	},
	defaultVariants: {
		size: "default",
	},
});

const SegmentedControlContext = React.createContext<
	VariantProps<typeof segmentedControlVariants>
>({ size: "default" });

type SegmentedControlProps = RadioGroupPrimitive.Props &
	VariantProps<typeof segmentedControlVariants>;

function SegmentedControl({
	className,
	size = "default",
	children,
	onValueChange,
	...props
}: SegmentedControlProps) {
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

function SegmentedControlItem({
	className,
	...props
}: RadioPrimitive.Root.Props) {
	const { size } = React.useContext(SegmentedControlContext);

	return (
		<RadioPrimitive.Root
			data-slot="segmented-control-item"
			data-size={size}
			className={cn(
				// The thumb slides behind the items, so items keep a transparent
				// background and only transition their text color.
				"inline-flex h-full min-w-0 items-center justify-center gap-1.5 rounded-md border border-transparent px-2.5 text-sm font-medium whitespace-nowrap text-foreground/60 outline-none transition-colors hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-checked:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-[size=sm]:px-2 data-[size=sm]:text-[0.8rem] dark:text-muted-foreground dark:hover:text-foreground dark:data-checked:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[size=sm]:[&_svg:not([class*='size-'])]:size-3.5",
				className,
			)}
			{...props}
		/>
	);
}

export {
	SegmentedControl,
	SegmentedControlItem,
	type SegmentedControlProps,
	segmentedControlVariants,
};
