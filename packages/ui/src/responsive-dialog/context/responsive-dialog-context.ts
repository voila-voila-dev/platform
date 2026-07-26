import * as React from "react";

// The root publishes which half is mounted so every part below it renders the
// matching surface without measuring the viewport again.
export const ResponsiveDialogContext = React.createContext<boolean | null>(
	null,
);

export function useResponsiveDialogIsMobile(part: string): boolean {
	const isMobile = React.use(ResponsiveDialogContext);
	if (isMobile === null) {
		throw new Error(`${part} must be used within <ResponsiveDialog.Root>`);
	}
	return isMobile;
}
