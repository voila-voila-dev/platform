import { XIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"button"> {}

export function BannerClose({ className, ...props }: Props) {
	return (
		<button
			type="button"
			data-slot="banner-close"
			aria-label="Dismiss"
			className={cn(
				"absolute top-1/2 right-3 inline-flex size-6 shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md opacity-70 transition-opacity outline-none hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-current/50 [&>svg]:size-4",
				className,
			)}
			{...props}
		>
			<XIcon aria-hidden />
		</button>
	);
}
