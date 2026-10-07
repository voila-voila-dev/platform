import type {
	Generator,
	GeneratorState,
	SpringOptions,
} from "#/generators/types.ts";

export interface SpringPhysics {
	readonly stiffness: number;
	readonly damping: number;
	readonly mass: number;
}

/** A spring that never settles would animate forever: stop looking after this. */
const MAX_DURATION = 20;
const SETTLE_STEP = 0.005;

/**
 * Duration and bounce to physics, SwiftUI's mapping: the undamped period is
 * the perceived duration, and the damping ratio is `1 - bounce`.
 */
export function springPhysics(options: SpringOptions = {}): SpringPhysics {
	const { stiffness, damping, mass } = options;
	if (stiffness !== undefined || damping !== undefined || mass !== undefined) {
		return {
			stiffness: stiffness ?? 100,
			damping: damping ?? 10,
			mass: mass ?? 1,
		};
	}
	const duration = Math.max(options.duration ?? 0.3, 0.001);
	const bounce = Math.min(Math.max(options.bounce ?? 0, 0), 0.95);
	return {
		stiffness: ((2 * Math.PI) / duration) ** 2,
		damping: (4 * Math.PI * (1 - bounce)) / duration,
		mass: 1,
	};
}

type Displacement = (t: number) => readonly [number, number];

/** The damped oscillator's closed form: displacement from the target and its velocity at `t`. */
function oscillator(
	physics: SpringPhysics,
	x0: number,
	v0: number,
): Displacement {
	const omega = Math.sqrt(physics.stiffness / physics.mass);
	const zeta =
		physics.damping / (2 * Math.sqrt(physics.stiffness * physics.mass));
	if (Math.abs(zeta - 1) < 1e-6) {
		const c = v0 + omega * x0;
		return (t) => {
			const decay = Math.exp(-omega * t);
			return [decay * (x0 + c * t), decay * (c - omega * (x0 + c * t))];
		};
	}
	if (zeta < 1) {
		const omegaD = omega * Math.sqrt(1 - zeta * zeta);
		const b = (v0 + zeta * omega * x0) / omegaD;
		return (t) => {
			const decay = Math.exp(-zeta * omega * t);
			const cos = Math.cos(omegaD * t);
			const sin = Math.sin(omegaD * t);
			const x = x0 * cos + b * sin;
			return [
				decay * x,
				decay * (-zeta * omega * x + omegaD * (b * cos - x0 * sin)),
			];
		};
	}
	const root = omega * Math.sqrt(zeta * zeta - 1);
	const r1 = -zeta * omega + root;
	const r2 = -zeta * omega - root;
	const c2 = (v0 - r1 * x0) / (r2 - r1);
	const c1 = x0 - c2;
	return (t) => {
		const e1 = c1 * Math.exp(r1 * t);
		const e2 = c2 * Math.exp(r2 * t);
		return [e1 + e2, r1 * e1 + r2 * e2];
	};
}

/** Rest thresholds scale with the motion, so 0→1 and 0→1000 both settle to the eye. */
function restThresholds(options: SpringOptions, span: number) {
	const restDelta = options.restDelta ?? Math.max(span, 1) * 0.001;
	return { restDelta, restSpeed: options.restSpeed ?? restDelta * 10 };
}

export function spring(
	options: SpringOptions & { from: number; to: number; velocity?: number },
): Generator {
	const { from, to } = options;
	const velocity = options.velocity ?? 0;
	const displacement = oscillator(springPhysics(options), from - to, velocity);
	const { restDelta, restSpeed } = restThresholds(options, Math.abs(to - from));

	function atRest(t: number): boolean {
		const [x, v] = displacement(t);
		return Math.abs(x) <= restDelta && Math.abs(v) <= restSpeed;
	}

	let duration = 0;
	while (duration < MAX_DURATION && !atRest(duration)) {
		duration += SETTLE_STEP;
	}

	return {
		duration,
		at(elapsed): GeneratorState {
			if (elapsed >= duration) {
				return { value: to, velocity: 0, done: true };
			}
			const [x, v] = displacement(Math.max(0, elapsed));
			return { value: to + x, velocity: v, done: false };
		},
	};
}
