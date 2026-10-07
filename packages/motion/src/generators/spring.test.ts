import { describe, expect, it } from "vitest";
import { spring, springPhysics } from "#/generators/spring.ts";

/** Semi-implicit Euler at a tiny step: the ground truth the closed form must match. */
function integrate(
	physics: { stiffness: number; damping: number; mass: number },
	from: number,
	to: number,
	velocity: number,
	until: number,
): number[] {
	const dt = 1e-5;
	const samples: number[] = [];
	let x = from;
	let v = velocity;
	const every = Math.round(0.05 / dt);
	const steps = Math.round(until / dt);
	for (let step = 0; step <= steps; step += 1) {
		if (step % every === 0) {
			samples.push(x);
		}
		const force = -physics.stiffness * (x - to) - physics.damping * v;
		v += (force / physics.mass) * dt;
		x += v * dt;
	}
	return samples;
}

describe("spring", () => {
	it.each([
		["under-damped", { stiffness: 200, damping: 8, mass: 1 }],
		["critically damped", { stiffness: 100, damping: 20, mass: 1 }],
		["over-damped", { stiffness: 100, damping: 40, mass: 1 }],
	])("%s matches a numerical integration", (_name, physics) => {
		const generator = spring({
			...physics,
			from: 0,
			to: 100,
			velocity: 50,
			restDelta: 1e-6,
		});
		const truth = integrate(physics, 0, 100, 50, 1);
		truth.forEach((value, index) => {
			expect(generator.at(index * 0.05).value).toBeCloseTo(value, 1);
		});
	});

	it("never overshoots without bounce", () => {
		const generator = spring({ from: 0, to: 1, duration: 0.3 });
		for (let t = 0; t <= generator.duration; t += 0.001) {
			expect(generator.at(t).value).toBeLessThanOrEqual(1 + 1e-9);
		}
	});

	it("overshoots with a bounce of 0.2", () => {
		const generator = spring({ from: 0, to: 1, duration: 0.3, bounce: 0.2 });
		let peak = 0;
		for (let t = 0; t <= generator.duration; t += 0.001) {
			peak = Math.max(peak, generator.at(t).value);
		}
		expect(peak).toBeGreaterThan(1.01);
		expect(peak).toBeLessThan(1.3);
	});

	it("maps bounce to the damping ratio", () => {
		const { stiffness, damping, mass } = springPhysics({
			duration: 0.5,
			bounce: 0.25,
		});
		expect(damping / (2 * Math.sqrt(stiffness * mass))).toBeCloseTo(0.75, 6);
		expect(springPhysics({ stiffness: 300 }).stiffness).toBe(300);
	});

	it("settles within its reported duration and stays there", () => {
		const generator = spring({ from: 0, to: 100, duration: 0.4, bounce: 0.3 });
		expect(generator.duration).toBeLessThan(2);
		expect(generator.at(generator.duration)).toEqual({
			value: 100,
			velocity: 0,
			done: true,
		});
		expect(
			Math.abs(generator.at(generator.duration - 0.005).value - 100),
		).toBeLessThan(0.2);
	});

	it("starts with the velocity it is given", () => {
		const generator = spring({ from: 0, to: 0, velocity: 300, duration: 0.3 });
		const start = generator.at(0);
		expect(start.velocity).toBeCloseTo(300, 6);
		expect(generator.at(0.02).value).toBeGreaterThan(0);
	});

	it("is done at once when there is nothing to move", () => {
		expect(spring({ from: 5, to: 5 }).duration).toBe(0);
	});

	it("reports velocity consistent with its value", () => {
		const generator = spring({ from: 0, to: 1, duration: 0.3, bounce: 0.3 });
		const h = 1e-6;
		const t = 0.1;
		const numeric =
			(generator.at(t + h).value - generator.at(t - h).value) / (2 * h);
		expect(generator.at(t).velocity).toBeCloseTo(numeric, 3);
	});
});
