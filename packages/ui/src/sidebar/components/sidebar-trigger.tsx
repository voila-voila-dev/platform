import { SidebarSimpleIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { Button } from "#/button/components/button.tsx";
import { useSidebar } from "#/sidebar/context/sidebar-context.ts";

interface Props extends React.ComponentProps<typeof Button> {}

export function SidebarTrigger({
	className,
	onClick,
	children,
	...props
}: Props) {
	const { toggleSidebar } = useSidebar();

	return (
		<Button
			data-slot="sidebar-trigger"
			variant="ghost"
			size="icon-sm"
			className={className}
			onClick={(event) => {
				onClick?.(event);
				toggleSidebar();
			}}
			{...props}
		>
			{children ?? (
				<>
					<SidebarSimpleIcon />
					<span className="sr-only">Toggle Sidebar</span>
				</>
			)}
		</Button>
	);
}
