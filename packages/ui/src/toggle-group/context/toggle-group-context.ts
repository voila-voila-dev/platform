import * as React from "react";
import type { VariantProps } from "#/lib/cva.ts";
import type { toggleVariants } from "#/toggle/components/toggle-variants.ts";

export type ToggleGroupContextValue = VariantProps<typeof toggleVariants> & {
	spacing?: number;
	orientation?: "horizontal" | "vertical";
};

export const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
	size: "default",
	variant: "default",
	spacing: 0,
	orientation: "horizontal",
});
