import * as React from "react";
import { Button } from "#/components/ui/button.tsx";
import {
	Dialog,
	DialogClose,
	DialogContent,
	type DialogContentSize,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog.tsx";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "#/components/ui/drawer.tsx";
import { useIsMobile } from "#/hooks/use-mobile.ts";
import { cn } from "#/lib/utils.ts";

// One API, two surfaces: a centered Base UI dialog on desktop and a vaul
// bottom drawer under the `useIsMobile` breakpoint (768px). The root owns the
// open state so it survives crossing the breakpoint while open — the two
// halves are different component trees, so uncontrolled state would reset.
//
// The halves disagree on composition (Base UI `render` vs Radix `asChild`);
// trigger/close bridge that by accepting the element form of `render` only.

const ResponsiveDialogContext = React.createContext<boolean | null>(null);

function useResponsiveDialogIsMobile(part: string): boolean {
	const isMobile = React.use(ResponsiveDialogContext);
	if (isMobile === null) {
		throw new Error(`${part} must be used within <ResponsiveDialog>`);
	}
	return isMobile;
}

function ResponsiveDialog({
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
		<ResponsiveDialogContext.Provider value={isMobile}>
			{isMobile ? (
				<Drawer open={isOpen} onOpenChange={handleOpenChange}>
					{children}
				</Drawer>
			) : (
				<Dialog open={isOpen} onOpenChange={handleOpenChange}>
					{children}
				</Dialog>
			)}
		</ResponsiveDialogContext.Provider>
	);
}

function ResponsiveDialogTrigger({
	render,
	children,
	...props
}: Omit<React.ComponentProps<typeof DrawerTrigger>, "asChild"> & {
	/** Element form only — the drawer half clones it, so render functions are unsupported. */
	render?: React.ReactElement;
}) {
	const isMobile = useResponsiveDialogIsMobile("ResponsiveDialogTrigger");
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
		<DialogTrigger render={render} {...props}>
			{children}
		</DialogTrigger>
	);
}

function ResponsiveDialogClose({
	render,
	children,
	...props
}: Omit<React.ComponentProps<typeof DrawerClose>, "asChild"> & {
	/** Element form only — the drawer half clones it, so render functions are unsupported. */
	render?: React.ReactElement;
}) {
	const isMobile = useResponsiveDialogIsMobile("ResponsiveDialogClose");
	if (isMobile) {
		if (render) {
			return (
				<DrawerClose asChild {...props}>
					{children === undefined
						? render
						: React.cloneElement(render, undefined, children)}
				</DrawerClose>
			);
		}
		return <DrawerClose {...props}>{children}</DrawerClose>;
	}
	return (
		<DialogClose render={render} {...props}>
			{children}
		</DialogClose>
	);
}

function ResponsiveDialogContent({
	className,
	children,
	size = "sm",
	showCloseButton = true,
	closeButtonLabel = "Close",
	overlayClassName,
	autoFocus = true,
}: {
	className?: string;
	children?: React.ReactNode;
	/** Desktop dialog width — the mobile drawer is always full-width. */
	size?: DialogContentSize;
	showCloseButton?: boolean;
	closeButtonLabel?: string;
	overlayClassName?: string;
	/**
	 * Whether opening moves focus into the content (the default). Pass `false`
	 * when the first field is a text input you don't want to focus on open —
	 * on a phone that focus opens the keyboard over the content you just asked to
	 * see. The content stays reachable by tab either way.
	 */
	autoFocus?: boolean;
}) {
	const isMobile = useResponsiveDialogIsMobile("ResponsiveDialogContent");
	if (isMobile) {
		return (
			<DrawerContent
				className={className}
				showCloseButton={showCloseButton}
				closeButtonLabel={closeButtonLabel}
				overlayClassName={overlayClassName}
				onOpenAutoFocus={
					autoFocus ? undefined : (event) => event.preventDefault()
				}
			>
				{children}
			</DrawerContent>
		);
	}
	return (
		<DialogContent
			className={className}
			size={size}
			showCloseButton={showCloseButton}
			closeButtonLabel={closeButtonLabel}
			overlayClassName={overlayClassName}
			initialFocus={autoFocus}
		>
			{children}
		</DialogContent>
	);
}

function ResponsiveDialogHeader(props: React.ComponentProps<"div">) {
	const isMobile = useResponsiveDialogIsMobile("ResponsiveDialogHeader");
	return isMobile ? <DrawerHeader {...props} /> : <DialogHeader {...props} />;
}

/**
 * Free-form content between header and footer. The dialog half already pads
 * its popup; the drawer half doesn't, so this adds the missing gutter there.
 */
function ResponsiveDialogBody({
	className,
	...props
}: React.ComponentProps<"div">) {
	const isMobile = useResponsiveDialogIsMobile("ResponsiveDialogBody");
	return (
		<div
			data-slot="responsive-dialog-body"
			className={cn(isMobile && "overflow-y-auto px-4", className)}
			{...props}
		/>
	);
}

function ResponsiveDialogFooter({
	className,
	closeLabel,
	children,
	...props
}: React.ComponentProps<"div"> & {
	closeLabel?: string;
}) {
	const isMobile = useResponsiveDialogIsMobile("ResponsiveDialogFooter");
	if (isMobile) {
		return (
			<DrawerFooter className={className} {...props}>
				{children}
				{/* Last in the column = bottom, matching the dialog footer's
				    col-reverse order where the close action sits below the primary. */}
				{closeLabel !== undefined && (
					<DrawerClose asChild>
						<Button data-slot="drawer-footer-close" variant="outline">
							{closeLabel}
						</Button>
					</DrawerClose>
				)}
			</DrawerFooter>
		);
	}
	return (
		<DialogFooter className={className} closeLabel={closeLabel} {...props}>
			{children}
		</DialogFooter>
	);
}

function ResponsiveDialogTitle({
	className,
	...props
}: React.ComponentProps<typeof DrawerTitle>) {
	const isMobile = useResponsiveDialogIsMobile("ResponsiveDialogTitle");
	return isMobile ? (
		<DrawerTitle className={className} {...props} />
	) : (
		<DialogTitle className={className} {...props} />
	);
}

function ResponsiveDialogDescription({
	className,
	...props
}: React.ComponentProps<typeof DrawerDescription>) {
	const isMobile = useResponsiveDialogIsMobile("ResponsiveDialogDescription");
	return isMobile ? (
		<DrawerDescription className={className} {...props} />
	) : (
		<DialogDescription className={className} {...props} />
	);
}

export {
	ResponsiveDialog,
	ResponsiveDialogBody,
	ResponsiveDialogClose,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogFooter,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle,
	ResponsiveDialogTrigger,
};
