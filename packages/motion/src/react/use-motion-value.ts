import * as React from "react";
import { type MotionValue, motionValue } from "#/value/motion-value.ts";

/** A motion value that lives as long as the component, created once. */
export function useMotionValue<T>(initial: T): MotionValue<T> {
	const [value] = React.useState(() => motionValue(initial));
	React.useEffect(() => () => value.stop(), [value]);
	return value;
}
