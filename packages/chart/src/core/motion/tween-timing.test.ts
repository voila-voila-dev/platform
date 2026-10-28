import { describe, expect, it } from "vitest";
import { chartTiming } from "#/core/motion/timing.ts";
import { tween } from "#/core/motion/tween-timing.ts";

describe("tween", () => {
	it("moves each channel along its easing and lands at its duration", () => {
		const motion = tween({ duration: 400, easing: "linear" }).motion(0, 100, 0);
		expect(motion.duration).toBe(0.4);
		expect(motion.at(0.2).value).toBeCloseTo(50);
		expect(motion.at(0.4).value).toBe(100);
	});

	it("is a timing <Chart> takes as it is", () => {
		const timing = tween({ stagger: 20 });
		expect(chartTiming(timing)).toBe(timing);
		expect(timing.stagger).toBe(0.02);
	});

	it("tells two tweens apart by value, the way <Chart> keys its animate prop", () => {
		expect(JSON.stringify(tween({ duration: 200 }))).toBe(
			JSON.stringify(tween({ duration: 200 })),
		);
		expect(JSON.stringify(tween({ duration: 200 }))).not.toBe(
			JSON.stringify(tween({ duration: 400 })),
		);
	});
});
