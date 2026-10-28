import * as React from "react";
import type { VariantProps } from "#/lib/cva.ts";
import type { segmentedControlVariants } from "#/segmented-control/components/segmented-control-variants.ts";

// The root passes its size and its stretch down; the item reads them to keep
// its padding, icon scale and share of the width in step without repeating the
// props on every segment.
export const SegmentedControlContext = React.createContext<
	VariantProps<typeof segmentedControlVariants>
>({ size: "default", stretch: false });
