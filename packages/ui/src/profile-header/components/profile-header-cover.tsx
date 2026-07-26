import type * as React from "react";
import { AspectRatio } from "#/aspect-ratio/components/aspect-ratio.tsx";
import { cn } from "#/lib/utils.ts";
import type { ProfileTheme } from "#/profile-header/components/profile-header-theme.ts";

/** Themed cover gradient used when no `coverImage` is supplied. */
const coverGradientClasses =
	"bg-gradient-to-br group-data-[theme=highlight]/profile-header-cover:from-highlight group-data-[theme=highlight]/profile-header-cover:via-highlight/80 group-data-[theme=highlight]/profile-header-cover:to-highlight/40 group-data-[theme=brand]/profile-header-cover:from-brand group-data-[theme=brand]/profile-header-cover:via-brand/80 group-data-[theme=brand]/profile-header-cover:to-brand/40";

interface Props extends React.ComponentProps<"div"> {
	coverImage?: React.ReactNode | string;
	theme?: ProfileTheme;
}

/** Cover band — renders a `coverImage` (node or src) or a themed gradient. */
export function ProfileHeaderCover({
	coverImage,
	theme = "brand",
	className,
	children,
	...props
}: Props) {
	return (
		<div
			data-slot="profile-header-cover"
			data-theme={theme}
			className={cn(
				"group/profile-header-cover relative overflow-hidden",
				className,
			)}
			{...props}
		>
			<AspectRatio ratio={3}>
				{typeof coverImage === "string" ? (
					<img
						src={coverImage}
						alt=""
						className="size-full object-cover"
						data-slot="profile-header-cover-image"
					/>
				) : coverImage ? (
					coverImage
				) : (
					<div
						aria-hidden
						data-slot="profile-header-cover-fallback"
						className={cn("size-full", coverGradientClasses)}
					/>
				)}
			</AspectRatio>
			{children}
		</div>
	);
}
