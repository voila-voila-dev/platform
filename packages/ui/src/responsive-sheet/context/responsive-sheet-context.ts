import * as React from "react";

// The root publishes which half is mounted so every part below it renders the
// matching surface without measuring the viewport again.
export const ResponsiveSheetContext = React.createContext<boolean | null>(null);

export function useResponsiveSheetIsMobile(part: string): boolean {
	const isMobile = React.use(ResponsiveSheetContext);
	if (isMobile === null) {
		throw new Error(`${part} must be used within <ResponsiveSheet.Root>`);
	}
	return isMobile;
}
