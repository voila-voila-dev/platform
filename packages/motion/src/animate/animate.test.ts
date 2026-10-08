import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setReducedMotion } from "#/accessibility/reduced-motion.ts";
import { animate } from "#/animate/animate.ts";
import { stagger } from "#/stagger/stagger.ts";
import { type ManualFrames, manualFrames } from "#/testing/manual-frames.ts";
import { motionValue } from "#/value/motion-value.ts";

const FRAME = 1000 / 60;
let clock: ManualFrames;

beforeEach(() => {
	clock = manualFrames();
});
afterEach(() => {
	clock.restore();
	setReducedMotion("user");
});

describe("animate a motion value", () => {
	it("springs to the target and settles on it exactly", async () => {
		const value = motionValue(0);
		const controls = animate(value, 100, { duration: 0.3 });
		clock.advance(150);
		expect(value.get()).toBeGreaterThan(50);
		expect(value.get()).toBeLessThan(100);
		clock.advance(controls.duration * 1000);
		await controls;
		expect(value.get()).toBe(100);
		expect(controls.state).toBe("finished");
	});

	it("keeps its speed when a new target interrupts it", () => {
		const value = motionValue(0);
		animate(value, 100, { duration: 0.4 });
		clock.advance(100);
		const before = value.getVelocity();
		const position = value.get();
		animate(value, 200, { duration: 0.4 });
		clock.advance(FRAME);
		const step = value.get() - position;
		// One frame later the value moved at about the speed it had: no kink, no restart from rest.
		expect(step / (FRAME / 1000)).toBeGreaterThan(before * 0.7);
		expect(step / (FRAME / 1000)).toBeLessThan(before * 1.6);
	});

	it("announces start and completion on the value", async () => {
		const value = motionValue(0);
		const started = vi.fn();
		const completed = vi.fn();
		value.on("animationStart", started);
		value.on("animationComplete", completed);
		const controls = animate(value, 1, { type: "tween", duration: 0.1 });
		expect(started).toHaveBeenCalledOnce();
		clock.advance(200);
		await controls;
		await Promise.resolve();
		expect(completed).toHaveBeenCalledOnce();
	});

	it("can be paused, scrubbed and completed", async () => {
		const value = motionValue(0);
		const controls = animate(value, [0, 100], {
			type: "tween",
			duration: 1,
			ease: "linear",
		});
		controls.pause();
		clock.advance(500);
		expect(value.get()).toBe(0);
		controls.time = 0.25;
		expect(value.get()).toBeCloseTo(25);
		controls.complete();
		await controls;
		expect(value.get()).toBe(100);
	});

	it("plays backwards at a negative speed and finishes where it started", async () => {
		const value = motionValue(0);
		const completed = vi.fn();
		value.on("animationComplete", completed);
		const controls = animate(value, [0, 100], {
			type: "tween",
			duration: 1,
			ease: "linear",
		});
		clock.advance(500);
		const halfway = value.get();
		controls.speed = -1;
		clock.advance(250);
		expect(value.get()).toBeLessThan(halfway);
		expect(controls.state).toBe("running");
		clock.advance(500);
		await controls;
		expect(value.get()).toBe(0);
		expect(controls.time).toBe(0);
		expect(completed).toHaveBeenCalledTimes(1);
	});

	it("completes backwards to the start at a negative speed", async () => {
		const value = motionValue(0);
		const controls = animate(value, [0, 100], { type: "tween", duration: 1 });
		clock.advance(300);
		controls.speed = -2;
		controls.complete();
		await controls;
		expect(value.get()).toBe(0);
	});

	it("repeats, reversing every other time", () => {
		const value = motionValue(0);
		const controls = animate(value, [0, 10], {
			type: "tween",
			duration: 1,
			ease: "linear",
			repeat: 1,
			repeatType: "reverse",
		});
		expect(controls.duration).toBe(2);
		controls.pause();
		controls.time = 1.5;
		expect(value.get()).toBeCloseTo(5);
		controls.time = 2;
		expect(value.get()).toBe(0);
	});
});

describe("animate anything else", () => {
	it("tweens a colour from one value to another", async () => {
		const seen: string[] = [];
		const controls = animate("#000000", "#ffffff", {
			duration: 0.2,
			onUpdate: (colour) => seen.push(colour),
		});
		clock.advance(controls.duration * 1000 + FRAME);
		await controls;
		expect(seen.length).toBeGreaterThan(3);
		expect(seen.at(-1)).toBe("#ffffff");
	});

	it("morphs a path", async () => {
		const seen: string[] = [];
		const square = "M0 0 L10 0 L10 10 L0 10 Z";
		const triangle = "M0 0 L10 10 L0 10 Z";
		const controls = animate(square, triangle, {
			duration: 0.2,
			onUpdate: (d) => seen.push(d),
		});
		clock.advance(controls.duration * 1000 + FRAME);
		await controls;
		expect(seen.some((d) => d !== square && d !== triangle)).toBe(true);
		expect(seen.at(-1)).toBe(triangle);
	});

	it("writes the keys of a plain object, one update per frame", async () => {
		const object = { x: 0, label: "a" };
		const onUpdate = vi.fn();
		const controls = animate(object, { x: 10 }, { duration: 0.2, onUpdate });
		clock.advance(400);
		await controls;
		expect(object.x).toBe(10);
		expect(onUpdate.mock.calls.length).toBeGreaterThan(3);
	});

	it("jumps under reduced motion", async () => {
		setReducedMotion("always");
		const value = motionValue(0);
		const controls = animate(value, 100);
		expect(value.get()).toBe(100);
		await controls;
		expect(controls.state).toBe("finished");
	});
});

describe("sequences", () => {
	it("places segments after one another, with relative and label times", () => {
		const a = motionValue(0);
		const b = motionValue(0);
		const c = motionValue(0);
		const linear = { type: "tween", ease: "linear", duration: 1 } as const;
		const controls = animate([
			[a, 1, linear],
			"middle",
			[b, 1, { ...linear, at: "-0.5" }],
			[c, 1, { ...linear, at: "middle" }],
		]);
		expect(controls.duration).toBeCloseTo(2);
		controls.pause();
		controls.time = 0.75;
		expect(a.get()).toBeCloseTo(0.75);
		expect(b.get()).toBeCloseTo(0.25);
		expect(c.get()).toBe(0);
		controls.time = 1.5;
		expect(c.get()).toBeCloseTo(0.5);
	});

	it("waits for an earlier segment on the same value, then starts from its end", async () => {
		const value = motionValue(0);
		const tween = { type: "tween", duration: 0.2 } as const;
		const controls = animate([
			[value, 10, tween],
			[value, 20, tween],
		]);
		clock.advance(250);
		expect(value.get()).toBe(10);
		// The second segment starts once the first one's promise settles.
		await new Promise((resolve) => setTimeout(resolve));
		clock.advance(300);
		await controls;
		expect(value.get()).toBe(20);
	});
});

describe("sequence duration", () => {
	it("counts a segment that waits for an earlier one on the same value", () => {
		const value = motionValue(0);
		const other = motionValue(0);
		const tween = { type: "tween", duration: 0.2 } as const;
		const controls = animate([
			[value, 10, tween],
			[value, 20, { ...tween, at: "<" }],
			[other, 1, { ...tween, at: "<" }],
			[other, 2, { ...tween, delay: 0.1 }],
		]);
		// value runs 0 → 0.2 then 0.2 → 0.4; other starts with its second
		// segment (0.2 → 0.4), then waits out its delay and runs 0.5 → 0.7.
		expect(controls.duration).toBeCloseTo(0.7);
	});

	it("places the segment after a waiting one at its end", () => {
		const value = motionValue(0);
		const next = motionValue(0);
		const tween = { type: "tween", duration: 0.2 } as const;
		const controls = animate([
			[value, 10, tween],
			[value, 20, { ...tween, at: 0 }],
			[next, 1, tween],
		]);
		expect(controls.duration).toBeCloseTo(0.6);
	});
});

describe("sequence speed", () => {
	it("reaches a segment that waits, and times its start by the sequence", async () => {
		const value = motionValue(0);
		const linear = { type: "tween", ease: "linear", duration: 0.2 } as const;
		const controls = animate([
			[value, 10, linear],
			[value, 20, linear],
		]);
		controls.speed = 2;
		clock.advance(110);
		expect(value.get()).toBe(10);
		await new Promise((resolve) => setTimeout(resolve));
		// At twice the speed, the second 0.2 s segment takes 0.1 s.
		clock.advance(50);
		// At speed 1 with a wall-clock start it would not have moved yet.
		expect(value.get()).toBeGreaterThan(12);
		expect(value.get()).toBeLessThan(20);
		clock.advance(60);
		await controls;
		expect(value.get()).toBe(20);
		expect(controls.speed).toBe(2);
	});

	it("never starts a waiting segment the sequence plays back past", async () => {
		const value = motionValue(0);
		const linear = { type: "tween", ease: "linear", duration: 0.2 } as const;
		const controls = animate([
			[value, 10, linear],
			[value, 20, linear],
		]);
		clock.advance(100);
		controls.speed = -1;
		clock.advance(150);
		await new Promise((resolve) => setTimeout(resolve));
		await controls;
		clock.advance(300);
		expect(value.get()).toBe(0);
	});
});

describe("sequence controls", () => {
	const linear = { type: "tween", ease: "linear", duration: 0.2 } as const;
	function twoSegments() {
		const value = motionValue(0);
		const controls = animate([
			[value, 10, linear],
			[value, 20, linear],
		]);
		return { value, controls };
	}
	function settle() {
		return new Promise((resolve) => setTimeout(resolve));
	}

	it("pauses a segment that started late", async () => {
		const { value, controls } = twoSegments();
		clock.advance(220);
		await settle();
		clock.advance(100);
		controls.pause();
		const held = value.get();
		expect(held).toBeGreaterThan(10);
		clock.advance(300);
		expect(value.get()).toBe(held);
		controls.play();
		clock.advance(300);
		await controls;
		expect(value.get()).toBe(20);
	});

	it("doesn't run the clock of a waiting segment while paused", async () => {
		const { value, controls } = twoSegments();
		clock.advance(100);
		controls.pause();
		clock.advance(1000);
		await settle();
		expect(value.get()).toBeCloseTo(5, 0);
		expect(controls.time).toBeCloseTo(0.1, 1);
	});

	it("seeks a paused sequence into a segment that hasn't started", () => {
		const { value, controls } = twoSegments();
		controls.pause();
		controls.time = 0.3;
		expect(value.get()).toBeCloseTo(15);
		expect(controls.time).toBeCloseTo(0.3);
	});

	it("never starts a waiting segment once cancelled", async () => {
		const { value, controls } = twoSegments();
		clock.advance(100);
		controls.cancel();
		await settle();
		clock.advance(500);
		await controls;
		expect(value.get()).toBe(0);
	});

	it("never starts a waiting segment once stopped", async () => {
		const { value, controls } = twoSegments();
		clock.advance(100);
		controls.stop();
		const held = value.get();
		await settle();
		clock.advance(500);
		await controls;
		expect(value.get()).toBe(held);
	});
});

describe("sequence cursor", () => {
	it("measures a relative time from the end of the segment just before", () => {
		const a = motionValue(0);
		const b = motionValue(0);
		const c = motionValue(0);
		const linear = { type: "tween", ease: "linear" } as const;
		const controls = animate([
			[a, 1, { ...linear, duration: 2 }],
			[b, 1, { ...linear, duration: 0.5, at: "<" }],
			[c, 1, { ...linear, duration: 1, at: "+0" }],
		]);
		controls.pause();
		controls.time = 1;
		// b ran from 0 to 0.5, so c started at 0.5.
		expect(c.get()).toBeCloseTo(0.5);
	});
});

describe("stagger as a delay", () => {
	it("delays each target by its index", () => {
		const values = [motionValue(0), motionValue(0), motionValue(0)];
		const delay = stagger(0.1);
		for (const [index, value] of values.entries()) {
			animate(value, 1, {
				type: "tween",
				duration: 0.1,
				delay: delay(index, 3),
			});
		}
		clock.advance(110);
		expect(values.map((value) => value.get() === 1)).toEqual([
			true,
			false,
			false,
		]);
	});
});
