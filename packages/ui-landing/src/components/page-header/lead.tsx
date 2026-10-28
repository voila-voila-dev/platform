import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";
import { Text } from "#/components/text.tsx";

interface Props extends React.ComponentProps<typeof Text> {}

export function PageHeaderLead({ className, ...props }: Props) {
	return (
		<Text
			data-slot="page-header-lead"
			variant="lead"
			className={cn("text-muted-foreground", className)}
			{...props}
		/>
	);
}
