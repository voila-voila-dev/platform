import { CaretLeftIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { cn } from "#/lib/utils.ts";
import { PaginationLink } from "#/pagination/components/pagination-link.tsx";

interface Props extends React.ComponentProps<typeof PaginationLink> {
	text?: string;
}

export function PaginationPrevious({
	className,
	text = "Previous",
	...props
}: Props) {
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
