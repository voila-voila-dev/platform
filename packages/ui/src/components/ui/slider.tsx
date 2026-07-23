import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import { cn } from "#/lib/utils.ts";

function resolveThumbValues(
	value: SliderPrimitive.Root.Props["value"],
	defaultValue: SliderPrimitive.Root.Props["defaultValue"],
	min: number,
): readonly number[] {
	const source = value ?? defaultValue;
	if (Array.isArray(source)) return source;
	if (typeof source === "number") return [source];
	return [min];
}

function Slider({
	className,
	children,
	defaultValue,
	value,
	min = 0,
	max = 100,
	...props
}: SliderPrimitive.Root.Props) {
	const thumbValues = resolveThumbValues(value, defaultValue, min);

	return (
		<SliderPrimitive.Root
			className={cn(
				"data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full",
				className,
			)}
			data-slot="slider"
			defaultValue={defaultValue}
			value={value}
			min={min}
			max={max}
			thumbAlignment="edge"
			{...props}
		>
			<SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col">
				<SliderPrimitive.Track
					data-slot="slider-track"
					className="relative grow overflow-hidden rounded-full bg-muted select-none data-[orientation=horizontal]:h-1 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1"
				>
					<SliderPrimitive.Indicator
						data-slot="slider-range"
						className="bg-primary select-none data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
					/>
				</SliderPrimitive.Track>
				{Array.from({ length: thumbValues.length }, (_, index) => (
					<SliderPrimitive.Thumb
						data-slot="slider-thumb"
						key={index}
						className="relative block size-3 shrink-0 rounded-full border border-ring bg-background ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-none active:ring-3 data-disabled:pointer-events-none data-disabled:opacity-50"
					/>
				))}
			</SliderPrimitive.Control>
			{children}
		</SliderPrimitive.Root>
	);
}

function SliderValue({ className, ...props }: SliderPrimitive.Value.Props) {
	return (
		<SliderPrimitive.Value
			data-slot="slider-value"
			className={cn("text-sm text-muted-foreground tabular-nums", className)}
			{...props}
		/>
	);
}

export { Slider, SliderValue };
