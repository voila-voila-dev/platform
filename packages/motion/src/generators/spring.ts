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

/** A spring that never settles would animate forever: stop it after this. */
const MAX_DURATION = 20;

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

/**
 * When `|p + q·t|·e^(−a·t)`, a bound on a distance or a speed, drops under
 * `threshold` for good. Newton on its logarithm, which is concave past the
 * peak: every step lands at or past the root, so it errs late, never early.
 */
function settleTime(p: number, q: number, a: number, threshold: number) {
	if (q < 0) {
		p = -p;
		q = -q;
	}
	const peak = 1 / a - p / q;
	function excess(t: number): number {
		return Math.log(p + q * t) - a * t - Math.log(threshold);
	}
	// No hump above the threshold: only the stretch before it crosses zero, if it does.
	if (q === 0 || excess(Math.max(0, peak)) <= 0) {
		return Math.max(0, Math.log(Math.abs(p) / threshold) / a);
	}
	let t = Math.max(0, peak) + 1 / a;
	for (let step = 0; step < 32; step += 1) {
		const next = t - excess(t) / (q / (p + q * t) - a);
		if (Math.abs(next - t) < 1e-6) return next;
		t = next;
	}
	return t;
}

/**
 * The damped oscillator's closed form: displacement from the target and its
 * velocity at `t`, and when both stay under the rest thresholds.
 */
function oscillator(
	physics: SpringPhysics,
	x0: number,
	v0: number,
	restDelta: number,
	restSpeed: number,
): readonly [Displacement, number] {
	const omega = Math.sqrt(physics.stiffness / physics.mass);
	const zeta =
		physics.damping / (2 * Math.sqrt(physics.stiffness * physics.mass));
	const critical = Math.abs(zeta - 1) < 1e-6;
	const slow = omega * (zeta < 1 ? zeta : zeta - Math.sqrt(zeta * zeta - 1));
	const b = v0 + zeta * omega * x0;
	/**
	 * Exact at critical damping. Elsewhere a bound, from sin(ωt) ≤ ωt and
	 * sinh(γt)/γ ≤ t·e^(γt), that stays tight near critical damping, where
	 * the amplitudes blow up while the motion doesn't.
	 */
	function near(p: number, q: number, threshold: number): number {
		return critical
			? settleTime(p, q, slow, threshold)
			: settleTime(Math.abs(p), Math.abs(q), slow, threshold);
	}
	const settle = Math.max(
		near(x0, b, restDelta),
		near(v0, -(zeta * omega * v0 + omega * omega * x0), restSpeed),
	);
	if (critical) {
		return [
			(t) => {
				const decay = Math.exp(-omega * t);
				return [decay * (x0 + b * t), decay * (b - omega * (x0 + b * t))];
			},
			settle,
		];
	}
	if (zeta < 1) {
		const omegaD = omega * Math.sqrt(1 - zeta * zeta);
		const sine = b / omegaD;
		const amplitude = Math.hypot(x0, sine);
		return [
			(t) => {
				const decay = Math.exp(-slow * t);
				const cos = Math.cos(omegaD * t);
				const sin = Math.sin(omegaD * t);
				const x = x0 * cos + sine * sin;
				return [decay * x, decay * (-slow * x + b * cos - omegaD * x0 * sin)];
			},
			Math.min(
				settle,
				Math.max(
					settleTime(amplitude, 0, slow, restDelta),
					settleTime(amplitude * omega, 0, slow, restSpeed),
				),
			),
		];
	}
	const r1 = -slow;
	const r2 = -2 * zeta * omega - r1;
	const c2 = (v0 - r1 * x0) / (r2 - r1);
	const c1 = x0 - c2;
	return [
		(t) => {
			const e1 = c1 * Math.exp(r1 * t);
			const e2 = c2 * Math.exp(r2 * t);
			return [e1 + e2, r1 * e1 + r2 * e2];
		},
		// Each mode on its own, with half of each threshold.
		Math.min(
			settle,
			Math.max(
				settleTime(c1, 0, -r1, restDelta / 2),
				settleTime(c2, 0, -r2, restDelta / 2),
				settleTime(r1 * c1, 0, -r1, restSpeed / 2),
				settleTime(r2 * c2, 0, -r2, restSpeed / 2),
			),
		),
	];
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
	const { restDelta, restSpeed } = restThresholds(options, Math.abs(to - from));
	const [displacement, settle] = oscillator(
		springPhysics(options),
		from - to,
		velocity,
		restDelta,
		restSpeed,
	);
	// An undamped spring never settles, and degenerate physics yields NaN.
	const duration = settle < MAX_DURATION ? settle : MAX_DURATION;

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
