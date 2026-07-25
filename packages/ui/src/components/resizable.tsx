import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "#/lib/utils.ts";

/**
 * Resizable panel layout (react-resizable-panels v4).
 *
 * Sizing contract: the Group sets inline `height: 100%; width: 100%`, so a
 * height class on the group itself (`h-48`) is silently overridden — give it a
 * sized parent instead, e.g. `<div className="h-48"><ResizablePanelGroup …>`.
 */
function ResizablePanelGroup({
	className,
	...props
}: ResizablePrimitive.GroupProps) {
	// Layout (display/flex-direction/height/width) comes entirely from the
	// library's inline styles, so no layout classes are needed here.
	return (
		<ResizablePrimitive.Group
			data-slot="resizable-panel-group"
			className={cn(className)}
			{...props}
		/>
	);
}

function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
	return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
	withHandle,
	className,
	...props
}: ResizablePrimitive.SeparatorProps & {
	withHandle?: boolean;
}) {
	return (
		<ResizablePrimitive.Separator
			data-slot="resizable-handle"
			// The library emits `data-separator=hover|active|focus|inactive` (its
			// hover state honours the wider hit area), so we drive the resting,
			// hover and drag affordance off those rather than CSS `:hover`. Note the
			// orientation inversion: a horizontal group emits a vertical separator.
			className={cn(
				"relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-2 after:-translate-x-1/2 after:transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-hidden data-[separator=hover]:after:bg-ring/40 data-[separator=active]:after:bg-ring data-[separator=active]:[&>[data-slot=resizable-handle-grip]]:bg-ring motion-reduce:after:transition-none aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-2 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
				className,
			)}
			{...props}
		>
			{withHandle && (
				<div
					data-slot="resizable-handle-grip"
					className="z-10 flex h-6 w-1 shrink-0 rounded-lg bg-muted-foreground/40 transition-colors motion-reduce:transition-none"
				/>
			)}
		</ResizablePrimitive.Separator>
	);
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
