interface Props extends React.ComponentProps<"div"> {}

export function StatsRowItem({ className, ...props }: Props) {
	return <div data-slot="stats-row-item" className={className} {...props} />;
}

import type * as React from "react";
