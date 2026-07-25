import type * as React from "react";
import { AspectRatio } from "#/components/aspect-ratio.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/avatar.tsx";
import { getInitials } from "#/components/user-avatar.tsx";
import { cn } from "#/lib/utils.ts";

type ProfileTheme = "brand" | "highlight";

// `theme` coordinates the themed children (cover gradient, avatar ring) off
// the `data-theme` attribute their group root emits.

/** Themed cover gradient used when no `coverImage` is supplied. */
const coverGradientClasses =
	"bg-gradient-to-br group-data-[theme=highlight]/profile-header-cover:from-highlight group-data-[theme=highlight]/profile-header-cover:via-highlight/80 group-data-[theme=highlight]/profile-header-cover:to-highlight/40 group-data-[theme=brand]/profile-header-cover:from-brand group-data-[theme=brand]/profile-header-cover:via-brand/80 group-data-[theme=brand]/profile-header-cover:to-brand/40";

/** Ring color that frames the overlapping avatar, matched to the theme. */
const avatarRingClasses =
	"group-data-[theme=highlight]/profile-header:ring-highlight/20 group-data-[theme=brand]/profile-header:ring-brand/20";

type ProfileHeaderAvatar = { src?: string; name?: string };

function isAvatarDescriptor(
	avatar: React.ReactNode | ProfileHeaderAvatar | undefined,
): avatar is ProfileHeaderAvatar {
	return (
		typeof avatar === "object" &&
		avatar !== null &&
		!("$$typeof" in (avatar as object))
	);
}

/** Cover band — renders a `coverImage` (node or src) or a themed gradient. */
function ProfileHeaderCover({
	coverImage,
	theme = "brand",
	className,
	children,
	...props
}: React.ComponentProps<"div"> & {
	coverImage?: React.ReactNode | string;
	theme?: ProfileTheme;
}) {
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

/**
 * Hero band for a freelancer or client profile: a themed cover, an
 * overlapping circular avatar, name + optional headline, a trust-badge row
 * and a right-aligned actions slot. Composable — the cover/body sub-parts are
 * exported so consumers can rebuild a custom hero when needed.
 */
function ProfileHeader({
	name,
	headline,
	coverImage,
	avatar,
	theme = "brand",
	badges,
	actions,
	className,
	children,
	...props
}: Omit<React.ComponentProps<"div">, "title"> & {
	name: string;
	headline?: React.ReactNode;
	coverImage?: React.ReactNode | string;
	avatar?: React.ReactNode | ProfileHeaderAvatar;
	theme?: ProfileTheme;
	badges?: React.ReactNode;
	actions?: React.ReactNode;
}) {
	const avatarNode = isAvatarDescriptor(avatar) ? (
		<Avatar
			size="lg"
			className={cn("size-16 ring-4 sm:size-24", avatarRingClasses)}
		>
			{avatar.src ? (
				<AvatarImage src={avatar.src} alt={avatar.name ?? name} />
			) : null}
			<AvatarFallback className="text-lg sm:text-2xl">
				{getInitials(avatar.name ?? name)}
			</AvatarFallback>
		</Avatar>
	) : avatar !== undefined ? (
		avatar
	) : (
		<Avatar
			size="lg"
			className={cn("size-16 ring-4 sm:size-24", avatarRingClasses)}
		>
			<AvatarFallback className="text-lg sm:text-2xl">
				{getInitials(name)}
			</AvatarFallback>
		</Avatar>
	);

	return (
		<div
			data-slot="profile-header"
			data-theme={theme}
			className={cn("group/profile-header flex flex-col", className)}
			{...props}
		>
			<ProfileHeaderCover coverImage={coverImage} theme={theme} />
			<div
				data-slot="profile-header-body"
				className="flex flex-col gap-3 px-4 pb-4 sm:flex-row sm:items-end sm:gap-4"
			>
				<div
					data-slot="profile-header-avatar"
					className="-mt-8 shrink-0 sm:-mt-12"
				>
					{avatarNode}
				</div>
				<div
					data-slot="profile-header-identity"
					className="flex min-w-0 flex-1 flex-col gap-2 sm:pb-1"
				>
					<div className="flex min-w-0 flex-col gap-0.5">
						<h1
							data-slot="profile-header-name"
							className="truncate text-xl font-semibold tracking-tight sm:text-2xl"
						>
							{name}
						</h1>
						{headline ? (
							<p
								data-slot="profile-header-headline"
								className="truncate text-sm text-muted-foreground"
							>
								{headline}
							</p>
						) : null}
					</div>
					{badges ? (
						<div
							data-slot="profile-header-badges"
							className="flex flex-wrap items-center gap-1.5"
						>
							{badges}
						</div>
					) : null}
				</div>
				{actions ? (
					<div
						data-slot="profile-header-actions"
						className="flex shrink-0 items-center gap-2 sm:pb-1"
					>
						{actions}
					</div>
				) : null}
			</div>
			{children}
		</div>
	);
}

export {
	ProfileHeader,
	ProfileHeaderCover,
	type ProfileTheme as ProfileHeaderTheme,
};
