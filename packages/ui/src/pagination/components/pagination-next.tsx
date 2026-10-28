import { CaretRightIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { cn } from "#/lib/utils.ts";
import { PaginationLink } from "#/pagination/components/pagination-link.tsx";

interface Props extends React.ComponentProps<typeof PaginationLink> {
	text?: string;
}

export function PaginationNext({ className, text = "Next", ...props }: Props) {
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
