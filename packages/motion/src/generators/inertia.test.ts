import { describe, expect, it } from "vitest";
import { inertia } from "#/generators/inertia.ts";

function sample(generator: ReturnType<typeof inertia>) {
	const values: number[] = [];
	for (let t = 0; t <= generator.duration + 0.01; t += 0.005) {
		values.push(generator.at(t).value);
	}
	return values;
}

describe("inertia", () => {
	it("glides towards from + power × velocity and settles", () => {
		const generator = inertia({ from: 0, velocity: 1000 });
		expect(generator.at(0).velocity).toBeCloseTo((1000 * 0.8) / 0.325, 3);
		expect(generator.duration).toBeGreaterThan(0);
		expect(generator.at(generator.duration)).toMatchObject({
			value: 800,
			done: true,
		});
	});

	it("snaps the resting point with modifyTarget", () => {
		const generator = inertia({
			from: 0,
			velocity: 1000,
			modifyTarget: (target) => Math.round(target / 300) * 300,
		});
		expect(generator.at(generator.duration).value).toBe(900);
	});

	it("springs back to max instead of passing it", () => {
		const generator = inertia({ from: 0, velocity: 1000, max: 200 });
		const values = sample(generator);
		expect(Math.max(...values)).toBeLessThan(300);
		expect(generator.at(generator.duration).value).toBe(200);
	});

	it("springs to min at once when it starts below it", () => {
		const generator = inertia({ from: -50, velocity: 0, min: 0 });
		expect(generator.at(generator.duration).value).toBe(0);
		expect(generator.at(0.05).value).toBeGreaterThan(-50);
	});
});
