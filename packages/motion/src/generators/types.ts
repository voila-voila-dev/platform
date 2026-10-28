export interface GeneratorState {
	readonly value: number;
	/** Units per second. */
	readonly velocity: number;
	readonly done: boolean;
}

/** One number moving over time: a spring, a tween or a decay. */
export interface Generator {
	/** Seconds until it settles. */
	readonly duration: number;
	/** The state `elapsed` seconds after the start. */
	at(elapsed: number): GeneratorState;
}

export interface SpringOptions {
	/**
	 * Perceived duration in seconds, SwiftUI's model: how long the motion
	 * looks like it takes, not when the last sub-pixel wobble ends. Ignored
	 * when `stiffness`, `damping` or `mass` is given.
	 */
	readonly duration?: number;
	/** 0 never overshoots; towards 1, springier. */
	readonly bounce?: number;
	readonly stiffness?: number;
	readonly damping?: number;
	readonly mass?: number;
	/** Below this speed (units per second) and `restDelta`, the spring is done. */
	readonly restSpeed?: number;
	readonly restDelta?: number;
}
