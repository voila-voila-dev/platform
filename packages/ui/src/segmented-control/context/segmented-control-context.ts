import * as React from "react";
import type { VariantProps } from "#/lib/cva.ts";
import type { segmentedControlVariants } from "#/segmented-control/components/segmented-control-variants.ts";

// The root only passes its size down; the item reads it to keep its padding
// and icon scale in step without repeating the prop on every segment.
export const SegmentedControlContext = React.createContext<
	VariantProps<typeof segmentedControlVariants>
>({ size: "default" });
