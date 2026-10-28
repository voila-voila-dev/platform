import type * as React from "react";
import { Drawer } from "#/drawer/components/drawer.tsx";
import { cn } from "#/lib/utils.ts";
import { useResponsiveSheetIsMobile } from "#/responsive-sheet/context/responsive-sheet-context.ts";
import { Sheet } from "#/sheet/components/sheet.tsx";

interface Props extends React.ComponentProps<"div"> {}

export function ResponsiveSheetHeader({ className, ...props }: Props) {
	const isMobile = useResponsiveSheetIsMobile("ResponsiveSheet.Header");
	return isMobile ? (
		// The bottom drawer centers its header by default; a detail panel reads
		// the same on both surfaces only if the mobile half stays left-aligned.
		<Drawer.Header
			className={cn(
				"group-data-[vaul-drawer-direction=bottom]/drawer-content:text-left",
				className,
			)}
			{...props}
		/>
	) : (
		<Sheet.Header className={className} {...props} />
	);
}
