import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { cn } from "@voila.dev/ui/lib/utils";
import { createContext, useContext, useState } from "react";

import { Container } from "#/components/container.tsx";

/**
 * Sticky marketing site header. Compose: Root > Bar (Brand + Nav > NavList >
 * NavItem… + Actions + MobileToggle) + MobileMenu > MobileNavItem… +
 * MobileActions. The mobile menu server-renders closed and hydrates.
 */

interface SiteHeaderContextValue {
	open: boolean;
	toggle: () => void;
}

const SiteHeaderContext = createContext<SiteHeaderContextValue>({
	open: false,
	toggle: () => {},
});

interface SiteHeaderRootProps extends React.ComponentProps<"header"> {
	defaultOpen?: boolean;
}

function Root({
	defaultOpen = false,
	className,
	...props
}: SiteHeaderRootProps) {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<SiteHeaderContext.Provider
			value={{ open, toggle: () => setOpen((value) => !value) }}
		>
			<header
				data-slot="site-header"
				className={cn(
					"sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg",
					className,
				)}
				{...props}
			/>
		</SiteHeaderContext.Provider>
	);
}

interface SiteHeaderBarProps extends React.ComponentProps<"nav"> {
	"aria-label"?: string;
}

function Bar({
	className,
	children,
	"aria-label": ariaLabel = "Main",
	...props
}: SiteHeaderBarProps) {
	return (
		<Container>
			<nav
				data-slot="site-header-bar"
				aria-label={ariaLabel}
				className={cn("flex h-16 items-center justify-between", className)}
				{...props}
			>
				{children}
			</nav>
		</Container>
	);
}

/** Logo slot — an anchor by default; pass `render` for a router Link. */
function Brand({ className, render, ...props }: useRender.ComponentProps<"a">) {
	return useRender({
		defaultTagName: "a",
		props: mergeProps<"a">(
			{
				className: cn("flex items-center", className),
			},
			props,
		),
		render,
		state: {
			slot: "site-header-brand",
		},
	});
}

/** Desktop-only nav area: link list + call-to-action cluster. */
function Nav({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="site-header-nav"
			className={cn("hidden items-center gap-8 md:flex", className)}
			{...props}
		/>
	);
}

function NavList({ className, ...props }: React.ComponentProps<"ul">) {
	return (
		<ul
			data-slot="site-header-nav-list"
			className={cn("flex items-center gap-6", className)}
			{...props}
		/>
	);
}

function NavItem({
	className,
	render,
	...props
}: useRender.ComponentProps<"a">) {
	const anchor = useRender({
		defaultTagName: "a",
		props: mergeProps<"a">(
			{
				className: cn(
					"text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
					className,
				),
			},
			props,
		),
		render,
		state: {
			slot: "site-header-nav-item",
		},
	});

	return <li>{anchor}</li>;
}

function Actions({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="site-header-actions"
			className={cn("flex items-center gap-3", className)}
			{...props}
		/>
	);
}

interface SiteHeaderMobileToggleProps extends React.ComponentProps<"button"> {
	"aria-label": string;
}

function MobileToggle({ className, ...props }: SiteHeaderMobileToggleProps) {
	const { open, toggle } = useContext(SiteHeaderContext);

	return (
		<button
			type="button"
			data-slot="site-header-mobile-toggle"
			aria-expanded={open}
			onClick={toggle}
			className={cn(
				"flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent md:hidden",
				className,
			)}
			{...props}
		>
			{open ? <XIcon className="h-6 w-6" /> : <ListIcon className="h-6 w-6" />}
		</button>
	);
}

function MobileMenu({
	className,
	children,
	...props
}: React.ComponentProps<"div">) {
	const { open } = useContext(SiteHeaderContext);

	return (
		<div
			data-slot="site-header-mobile-menu"
			className={cn(
				"border-t border-border bg-background md:hidden",
				!open && "hidden",
				className,
			)}
			{...props}
		>
			<Container>
				<ul className="flex flex-col gap-2 py-4">{children}</ul>
			</Container>
		</div>
	);
}

function MobileNavItem({
	className,
	render,
	...props
}: useRender.ComponentProps<"a">) {
	const anchor = useRender({
		defaultTagName: "a",
		props: mergeProps<"a">(
			{
				className: cn(
					"block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
					className,
				),
			},
			props,
		),
		render,
		state: {
			slot: "site-header-mobile-nav-item",
		},
	});

	return <li>{anchor}</li>;
}

/** Call-to-action cluster closing the mobile menu. */
function MobileActions({ className, ...props }: React.ComponentProps<"li">) {
	return (
		<li
			data-slot="site-header-mobile-actions"
			className={cn(
				"mt-2 flex flex-col gap-2 border-t border-border pt-4",
				className,
			)}
			{...props}
		/>
	);
}

export const SiteHeader = {
	Root,
	Bar,
	Brand,
	Nav,
	NavList,
	NavItem,
	Actions,
	MobileToggle,
	MobileMenu,
	MobileNavItem,
	MobileActions,
};

export type {
	SiteHeaderBarProps,
	SiteHeaderMobileToggleProps,
	SiteHeaderRootProps,
};
