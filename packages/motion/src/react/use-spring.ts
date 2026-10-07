import * as React from "react";
import { animate } from "#/animate/animate.ts";
import type { AnimationOptions } from "#/animate/types.ts";
import { useMotionValue } from "#/react/use-motion-value.ts";
import { isMotionValue, type MotionValue } from "#/value/motion-value.ts";

/**
 * A value that springs towards `target` whenever it changes: a number from
 * props, or another motion value it follows. A new target mid-flight keeps
 * the speed the value has.
 */
export function useSpring(
	target: number | MotionValue<number>,
	options: AnimationOptions = {},
): MotionValue<number> {
	const value = useMotionValue(
		isMotionValue(target) ? (target as MotionValue<number>).get() : target,
	);
	const optionsRef = React.useRef(options);
	optionsRef.current = options;

	React.useEffect(() => {
		function follow(next: number) {
			animate(value, next, { ...optionsRef.current, type: "spring" });
		}
		if (!isMotionValue(target)) {
			if (value.get() !== target) follow(target);
			return;
		}
		const source = target as MotionValue<number>;
		return source.on("change", follow);
	}, [target, value]);

	return value;
}
