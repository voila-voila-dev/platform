import * as React from "react";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "#/components/ui/drawer.tsx";
import {
	Sheet,
	SheetContent,
	type SheetContentSize,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "#/components/ui/sheet.tsx";
import { useIsMobile } from "#/hooks/use-mobile.ts";
import { cn } from "#/lib/utils.ts";

// One API, two surfaces: a side sheet on desktop and a vaul bottom drawer under
// the `useIsMobile` breakpoint (768px) — the same split `ResponsiveDialog` makes
// for centered dialogs. The root owns the open state so it survives crossing the
// breakpoint while open: the two halves are different component trees, so
// uncontrolled state would reset.
//
// The halves disagree on composition (Base UI `render` vs Radix `asChild`); the
// trigger bridges that by accepting the element form of `render` only.

const ResponsiveSheetContext = React.createContext<boolean | null>(null);

function useResponsiveSheetIsMobile(part: string): boolean {
	const isMobile = React.use(ResponsiveSheetContext);
	if (isMobile === null) {
		throw new Error(`${part} must be used within <ResponsiveSheet>`);
	}
	return isMobile;
}

function ResponsiveSheet({
	open,
	defaultOpen = false,
	onOpenChange,
	children,
}: {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	children?: React.ReactNode;
}) {
	const isMobile = useIsMobile();
	const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
	const isOpen = open ?? uncontrolledOpen;
	const handleOpenChange = (nextOpen: boolean) => {
		setUncontrolledOpen(nextOpen);
		onOpenChange?.(nextOpen);
	};

	return (
		<ResponsiveSheetContext.Provider value={isMobile}>
			{isMobile ? (
				<Drawer open={isOpen} onOpenChange={handleOpenChange}>
					{children}
				</Drawer>
			) : (
				<Sheet open={isOpen} onOpenChange={handleOpenChange}>
					{children}
				</Sheet>
			)}
		</ResponsiveSheetContext.Provider>
	);
}

function ResponsiveSheetTrigger({
	render,
	children,
	...props
}: Omit<React.ComponentProps<typeof DrawerTrigger>, "asChild"> & {
	/** Element form only — the drawer half clones it, so render functions are unsupported. */
	render?: React.ReactElement;
}) {
	const isMobile = useResponsiveSheetIsMobile("ResponsiveSheetTrigger");
	if (isMobile) {
		if (render) {
			return (
				<DrawerTrigger asChild {...props}>
					{children === undefined
						? render
						: React.cloneElement(render, undefined, children)}
				</DrawerTrigger>
			);
		}
		return <DrawerTrigger {...props}>{children}</DrawerTrigger>;
	}
	return (
		<SheetTrigger render={render} {...props}>
			{children}
		</SheetTrigger>
	);
}

function ResponsiveSheetContent({
	className,
	children,
	size = "default",
	showCloseButton = true,
	closeButtonLabel = "Close",
}: {
	className?: string;
	children?: React.ReactNode;
	/** Desktop panel width — the mobile drawer is always full-width. */
	size?: SheetContentSize;
	showCloseButton?: boolean;
	closeButtonLabel?: string;
}) {
	const isMobile = useResponsiveSheetIsMobile("ResponsiveSheetContent");
	if (isMobile) {
		return (
			<DrawerContent
				className={className}
				showCloseButton={showCloseButton}
				closeButtonLabel={closeButtonLabel}
			>
				{children}
			</DrawerContent>
		);
	}
	return (
		<SheetContent
			className={className}
			size={size}
			showCloseButton={showCloseButton}
			closeButtonLabel={closeButtonLabel}
		>
			{children}
		</SheetContent>
	);
}

function ResponsiveSheetHeader({
	className,
	...props
}: React.ComponentProps<"div">) {
	const isMobile = useResponsiveSheetIsMobile("ResponsiveSheetHeader");
	return isMobile ? (
		// The bottom drawer centers its header by default; a detail panel reads
		// the same on both surfaces only if the mobile half stays left-aligned.
		<DrawerHeader
			className={cn(
				"group-data-[vaul-drawer-direction=bottom]/drawer-content:text-left",
				className,
			)}
			{...props}
		/>
	) : (
		<SheetHeader className={className} {...props} />
	);
}

/** The scrolling region between header and footer, gutters included. */
function ResponsiveSheetBody({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="responsive-sheet-body"
			className={cn(
				"flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4",
				className,
			)}
			{...props}
		/>
	);
}

function ResponsiveSheetFooter({
	className,
	...props
}: React.ComponentProps<"div">) {
	const isMobile = useResponsiveSheetIsMobile("ResponsiveSheetFooter");
	return isMobile ? (
		<DrawerFooter className={className} {...props} />
	) : (
		<SheetFooter className={className} {...props} />
	);
}

function ResponsiveSheetTitle({
	className,
	...props
}: React.ComponentProps<typeof DrawerTitle>) {
	const isMobile = useResponsiveSheetIsMobile("ResponsiveSheetTitle");
	return isMobile ? (
		<DrawerTitle className={className} {...props} />
	) : (
		<SheetTitle className={className} {...props} />
	);
}

function ResponsiveSheetDescription({
	className,
	...props
}: React.ComponentProps<typeof DrawerDescription>) {
	const isMobile = useResponsiveSheetIsMobile("ResponsiveSheetDescription");
	return isMobile ? (
		<DrawerDescription className={className} {...props} />
	) : (
		<SheetDescription className={className} {...props} />
	);
}

export {
	ResponsiveSheet,
	ResponsiveSheetBody,
	ResponsiveSheetContent,
	ResponsiveSheetDescription,
	ResponsiveSheetFooter,
	ResponsiveSheetHeader,
	ResponsiveSheetTitle,
	ResponsiveSheetTrigger,
};
