import * as React from "react";
import { cn } from "#/lib/utils.ts";
import { Skeleton } from "#/skeleton/components/skeleton.tsx";

interface Props extends React.ComponentProps<"div"> {
	showIcon?: boolean;
}

export function SidebarMenuSkeleton({
	className,
	showIcon = false,
	...props
}: Props) {
	// Deterministic width between 50 and 90% derived from useId so server and
	// client render the same markup (Math.random() caused hydration mismatches).
	const id = React.useId();
	const width = React.useMemo(() => {
		let hash = 0;
		for (const character of id) {
			hash = (hash * 31 + character.charCodeAt(0)) % 41;
		}
		return `${hash + 50}%`;
	}, [id]);

	return (
		<div
			data-slot="sidebar-menu-skeleton"
			className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
			{...props}
		>
			{showIcon && <Skeleton className="size-4 rounded-md" />}
			<Skeleton
				className="h-4 max-w-(--skeleton-width) flex-1"
				style={
					{
						"--skeleton-width": width,
					} as React.CSSProperties
				}
			/>
		</div>
	);
}
