import type * as React from "react";

interface Props extends React.ComponentProps<"nav"> {}

export function BreadcrumbRoot({ className, ...props }: Props) {
	return (
		<nav
			aria-label="breadcrumb"
			data-slot="breadcrumb"
			className={className}
			{...props}
		/>
	);
}
