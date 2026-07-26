import * as React from "react";

export const ButtonGroupContext = React.createContext<
	"horizontal" | "vertical"
>("horizontal");
