import type * as React from "react";
import {
	accentHighlightBlobClass,
	brandGradientClass,
} from "#/landing/lib/tones.ts";

import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"article"> {}

/** The gradient hero tile — spans two rows on desktop, owns the blur blobs. */
export function BentoGridFeaturedItem({
	className,
	children,
	...props
}: Props) {
	return (
		<article
			data-slot="bento-featured-item"
			className={cn(
				"animate-fade-up relative flex flex-col justify-between overflow-hidden rounded-2xl p-8 text-primary-foreground shadow-xl lg:row-span-2",
				brandGradientClass,
				className,
			)}
			{...props}
		>
			<div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
			<div
				className={cn(
					"pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full blur-3xl",
					accentHighlightBlobClass,
				)}
			/>
			{children}
		</article>
	);
}
