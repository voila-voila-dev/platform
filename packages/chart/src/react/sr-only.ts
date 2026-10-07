import type * as React from "react";

/** Present to assistive tech, invisible on screen, and never wider than one pixel. */
export const SR_ONLY: React.CSSProperties = {
	position: "absolute",
	width: 1,
	height: 1,
	padding: 0,
	margin: -1,
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	border: 0,
};
