import type * as React from "react";
import { Avatar } from "#/avatar/components/avatar.tsx";
import { cn } from "#/lib/utils.ts";
import { ProfileHeaderCover } from "#/profile-header/components/profile-header-cover.tsx";
import type { ProfileTheme } from "#/profile-header/components/profile-header-theme.ts";
import { getInitials } from "#/user-avatar/lib/get-initials.ts";

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

interface Props extends Omit<React.ComponentProps<"div">, "title"> {
	name: string;
	headline?: React.ReactNode;
	coverImage?: React.ReactNode | string;
	avatar?: React.ReactNode | ProfileHeaderAvatar;
	theme?: ProfileTheme;
	badges?: React.ReactNode;
	actions?: React.ReactNode;
}

/**
 * Hero band for a freelancer or client profile: a themed cover, an
 * overlapping circular avatar, name + optional headline, a trust-badge row
 * and a right-aligned actions slot. Composable — the cover/body sub-parts are
 * exported so consumers can rebuild a custom hero when needed.
 */
export function ProfileHeaderRoot({
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
}: Props) {
	const avatarNode = isAvatarDescriptor(avatar) ? (
		<Avatar.Root
			size="lg"
			className={cn("size-16 ring-4 sm:size-24", avatarRingClasses)}
		>
			{avatar.src ? (
				<Avatar.Image src={avatar.src} alt={avatar.name ?? name} />
			) : null}
			<Avatar.Fallback className="text-lg sm:text-2xl">
				{getInitials(avatar.name ?? name)}
			</Avatar.Fallback>
		</Avatar.Root>
	) : avatar !== undefined ? (
		avatar
	) : (
		<Avatar.Root
			size="lg"
			className={cn("size-16 ring-4 sm:size-24", avatarRingClasses)}
		>
			<Avatar.Fallback className="text-lg sm:text-2xl">
				{getInitials(name)}
			</Avatar.Fallback>
		</Avatar.Root>
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
