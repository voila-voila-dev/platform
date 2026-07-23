import {
	CaretLeftIcon,
	CaretRightIcon,
	DotsThreeIcon,
} from "@phosphor-icons/react";
import type * as React from "react";
import { Button } from "#/components/ui/button.tsx";
import { cn } from "#/lib/utils.ts";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
	return (
		<nav
			// Sentence case to match the kit's other nav labels; spread-overridable
			// (e.g. a French `aria-label="Pagination"`) since `{...props}` wins.
			aria-label="Pagination"
			data-slot="pagination"
			className={cn("mx-auto flex w-full justify-center", className)}
			{...props}
		/>
	);
}

function PaginationContent({
	className,
	...props
}: React.ComponentProps<"ul">) {
	return (
		<ul
			data-slot="pagination-content"
			className={cn("flex items-center gap-0.5", className)}
			{...props}
		/>
	);
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
	return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
	isActive?: boolean;
	/**
	 * Render the link as non-interactive (e.g. Previous on the first page):
	 * `aria-disabled`, removed from the tab order, and dimmed. Maps to the kit's
	 * `aria-disabled:` styling idiom rather than a dead `href`.
	 */
	isDisabled?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size" | "variant"> &
	React.ComponentProps<"a">;

function PaginationLink({
	className,
	isActive,
	isDisabled,
	size = "icon",
	variant,
	...props
}: PaginationLinkProps) {
	return (
		<Button
			// `variant` overrides the active/inactive default so consumers can opt
			// into e.g. a `secondary` active page without re-implementing the link.
			variant={variant ?? (isActive ? "outline" : "ghost")}
			size={size}
			className={cn(
				"aria-disabled:pointer-events-none aria-disabled:opacity-50",
				className,
			)}
			nativeButton={false}
			render={
				<a
					data-slot="pagination-link"
					data-active={isActive}
					aria-current={isActive ? "page" : undefined}
					{...props}
					aria-disabled={isDisabled || undefined}
					tabIndex={isDisabled ? -1 : props.tabIndex}
				/>
			}
		/>
	);
}

function PaginationPrevious({
	className,
	text = "Previous",
	...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
	return (
		<PaginationLink
			aria-label="Go to previous page"
			size="default"
			className={cn("pl-1.5!", className)}
			{...props}
		>
			<CaretLeftIcon data-icon="inline-start" />
			<span className="hidden sm:block">{text}</span>
		</PaginationLink>
	);
}

function PaginationNext({
	className,
	text = "Next",
	...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
	return (
		<PaginationLink
			aria-label="Go to next page"
			size="default"
			className={cn("pr-1.5!", className)}
			{...props}
		>
			<span className="hidden sm:block">{text}</span>
			<CaretRightIcon data-icon="inline-end" />
		</PaginationLink>
	);
}

function PaginationEllipsis({
	className,
	...props
}: React.ComponentProps<"span">) {
	return (
		// Decorative gap indicator: `aria-hidden` hides it from the a11y tree, so
		// it carries no sr-only text (the old one was unreachable inside the hidden
		// subtree). The surrounding page links convey the skipped range.
		<span
			aria-hidden
			data-slot="pagination-ellipsis"
			className={cn(
				"flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		>
			<DotsThreeIcon />
		</span>
	);
}

export {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
};
