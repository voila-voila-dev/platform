import { describe, expect, it } from "vitest";

import { motionValue } from "#/value/motion-value.ts";
import { transformValue } from "#/value/transform.ts";

describe("transformValue", () => {
	it("maps a source through a range and follows it", () => {
		const x = motionValue(0);
		const opacity = transformValue(x, [0, 100], [1, 0]);
		expect(opacity.get()).toBe(1);
		x.set(25);
		expect(opacity.get()).toBeCloseTo(0.75);
	});

	it("combines several sources", () => {
		const x = motionValue(3);
		const y = motionValue(0);
		const length = transformValue([x, y], (a: number, b: number) =>
			Math.hypot(a, b),
		);
		y.set(4);
		expect(length.get()).toBe(5);
	});

	it("lets go of its sources when destroyed", () => {
		const x = motionValue(1);
		const double = transformValue(x, (value) => value * 2);
		x.set(2);
		expect(double.get()).toBe(4);
		double.destroy();
		x.set(5);
		expect(double.get()).toBe(4);
	});
});
