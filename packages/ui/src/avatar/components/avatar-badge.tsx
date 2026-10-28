import type * as React from "react";
import { avatarBadgeVariants } from "#/avatar/components/avatar-badge-variants.ts";
import type { VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";

interface Props
	extends React.ComponentProps<"span">,
		VariantProps<typeof avatarBadgeVariants> {}

export function AvatarBadge({ className, status, ...props }: Props) {
	return (
		<span
			data-slot="avatar-badge"
			data-status={status}
			className={cn(avatarBadgeVariants({ status }), className)}
			{...props}
		/>
	);
}
