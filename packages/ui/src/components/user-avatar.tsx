import type * as React from "react";
import {
	Avatar,
	AvatarBadge,
	AvatarFallback,
	AvatarImage,
} from "#/components/avatar.tsx";

import { cn } from "#/lib/utils.ts";

/** Derive up-to-two-letter initials from a full name ("Camille Dubois" → "CD"). */
function getInitials(name: string): string {
	const words = name.trim().split(/\s+/).filter(Boolean);
	const firstLetter = words[0]?.[0] ?? "";
	const lastLetter = words.length > 1 ? (words.at(-1)?.[0] ?? "") : "";
	return `${firstLetter}${lastLetter}`.toUpperCase();
}

/**
 * Identity row pairing an Avatar with a name and an optional role line - the
 * recurring pattern in chat headers, tables and cards. Initials are derived
 * from `name` when the image is missing or fails to load.
 */
function UserAvatar({
	className,
	name,
	description,
	src,
	status,
	size = "default",
	...props
}: React.ComponentProps<"div"> & {
	name: string;
	description?: React.ReactNode;
	src?: string;
	status?: React.ComponentProps<typeof AvatarBadge>["status"];
	size?: React.ComponentProps<typeof Avatar>["size"];
}) {
	return (
		<div
			data-slot="user-avatar"
			data-size={size}
			className={cn(
				"group/user-avatar flex min-w-0 items-center gap-2",
				className,
			)}
			{...props}
		>
			<Avatar size={size}>
				{src ? <AvatarImage src={src} alt={name} /> : null}
				<AvatarFallback>{getInitials(name)}</AvatarFallback>
				{status ? <AvatarBadge status={status} /> : null}
			</Avatar>
			<div className="flex min-w-0 flex-col">
				<span
					data-slot="user-avatar-name"
					className="truncate text-sm leading-tight font-medium"
				>
					{name}
				</span>
				{description ? (
					<span
						data-slot="user-avatar-description"
						className="truncate text-xs leading-tight text-muted-foreground"
					>
						{description}
					</span>
				) : null}
			</div>
		</div>
	);
}

export { getInitials, UserAvatar };
