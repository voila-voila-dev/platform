interface Props extends React.ComponentProps<"div"> {}

export function SiteFooterColumn({ className, ...props }: Props) {
	return (
		<div data-slot="site-footer-column" className={className} {...props} />
	);
}

import type * as React from "react";
