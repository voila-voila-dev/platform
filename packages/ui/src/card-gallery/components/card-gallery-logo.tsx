import type * as React from "react";
import { AvatarFallback } from "#/avatar/components/avatar-fallback.tsx";
import { AvatarImage } from "#/avatar/components/avatar-image.tsx";
import { AvatarRoot } from "#/avatar/components/avatar-root.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	/** Image URL, shown large in a square frame. */
	src?: string;
	/** `alt` for the image. Defaults to empty — the title sits right below. */
	alt?: string;
}

/**
 * The card's large square visual. Children are the fallback, shown while the
 * image loads or when there is none — an initial, an icon, anything.
 */
export function CardGalleryLogo({
	src,
	alt = "",
	className,
	children,
	...props
}: Props) {
	return (
		<div
			data-slot="card-gallery-logo"
			className={cn("aspect-square w-full max-w-32", className)}
			{...props}
		>
			<AvatarRoot className="size-full rounded-lg after:rounded-lg">
				{src !== undefined && (
					<AvatarImage src={src} alt={alt} className="rounded-lg" />
				)}
				<AvatarFallback className="rounded-lg font-medium text-3xl">
					{children}
				</AvatarFallback>
			</AvatarRoot>
		</div>
	);
}
