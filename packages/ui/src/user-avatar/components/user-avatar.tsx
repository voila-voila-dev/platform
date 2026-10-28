import type * as React from "react";
import { Avatar } from "#/avatar/components/avatar.tsx";
import { cn } from "#/lib/utils.ts";
import { getInitials } from "#/user-avatar/lib/get-initials.ts";

interface Props extends React.ComponentProps<"div"> {
	name: string;
	description?: React.ReactNode;
	src?: string;
	status?: React.ComponentProps<typeof Avatar.Badge>["status"];
	size?: React.ComponentProps<typeof Avatar.Root>["size"];
}

export function UserAvatar({
	className,
	name,
	description,
	src,
	status,
	size = "default",
	...props
}: Props) {
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
			<Avatar.Root size={size}>
				{src ? <Avatar.Image src={src} alt={name} /> : null}
				<Avatar.Fallback>{getInitials(name)}</Avatar.Fallback>
				{status ? <Avatar.Badge status={status} /> : null}
			</Avatar.Root>
			<div data-slot="user-avatar-body" className="flex min-w-0 flex-col">
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
