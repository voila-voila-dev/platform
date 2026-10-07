import { linearEasing } from "#/easing/linear-css.ts";
import type { Easing } from "#/easing/types.ts";
import { spring } from "#/generators/spring.ts";
import type { SpringOptions } from "#/generators/types.ts";

export interface SpringEasing {
	/** Seconds until the spring settles: the WAAPI duration to play `easing` over. */
	readonly duration: number;
	readonly easing: string;
	readonly at: Easing;
}

/** A spring from 0 to 1 as an easing: what WAAPI plays for a DOM spring. */
export function springEasing(options: SpringOptions = {}): SpringEasing {
	const generator = spring({ ...options, from: 0, to: 1 });
	const duration = generator.duration;
	function at(progress: number): number {
		return generator.at(progress * duration).value;
	}
	return {
		duration,
		easing: duration > 0 ? linearEasing(at, duration) : "linear(0, 1)",
		at,
	};
}
