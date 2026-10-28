interface Props extends React.ComponentProps<"div"> {}

export function BentoGridItemBody({ className, ...props }: Props) {
	return <div data-slot="bento-item-body" className={className} {...props} />;
}

import type * as React from "react";
