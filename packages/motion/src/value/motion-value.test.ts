import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { frame } from "#/frame/frame.ts";
import { type ManualFrames, manualFrames } from "#/testing/manual-frames.ts";
import { isMotionValue, motionValue } from "#/value/motion-value.ts";

let clock: ManualFrames;
beforeEach(() => {
	clock = manualFrames();
});
afterEach(() => clock.restore());

function setNextFrame<T>(value: { set(next: T): void }, next: T): void {
	frame.update(() => value.set(next));
	clock.advance(1000 / 60);
}

describe("motionValue", () => {
	it("gets, sets and tells its listeners until they leave", () => {
		const value = motionValue(0);
		const listener = vi.fn();
		const leave = value.on("change", listener);
		value.set(5);
		expect(value.get()).toBe(5);
		expect(value.getPrevious()).toBe(0);
		leave();
		value.set(6);
		expect(listener.mock.calls).toEqual([[5]]);
		expect(isMotionValue(value)).toBe(true);
		expect(isMotionValue({ get: () => 0 })).toBe(false);
	});

	it("measures velocity in units per second across frames", () => {
		const value = motionValue(0);
		setNextFrame(value, 10);
		setNextFrame(value, 20);
		expect(value.getVelocity()).toBeCloseTo(600);
	});

	it("keeps the previous frame's sample when set twice in one frame", () => {
		const value = motionValue(0);
		setNextFrame(value, 10);
		frame.update(() => {
			value.set(15);
			value.set(20);
		});
		clock.advance(1000 / 60);
		expect(value.getVelocity()).toBeCloseTo(600);
	});

	it("reads no velocity once left alone, or for a non-number", () => {
		const value = motionValue(0);
		setNextFrame(value, 10);
		setNextFrame(value, 20);
		clock.advance(40);
		expect(value.getVelocity()).toBe(0);
		const label = motionValue("a");
		setNextFrame(label, "b");
		expect(label.getVelocity()).toBe(0);
	});

	it("jumps with no velocity, stopping its animation", () => {
		const value = motionValue(0);
		const stop = vi.fn();
		value.start({ stop });
		setNextFrame(value, 10);
		value.jump(50);
		expect(stop).toHaveBeenCalledOnce();
		expect(value.get()).toBe(50);
		expect(value.getVelocity()).toBe(0);
		expect(value.isAnimating()).toBe(false);
	});

	it("cancels the running animation when another starts", () => {
		const value = motionValue(0);
		const events: string[] = [];
		value.on("animationStart", () => events.push("start"));
		value.on("animationCancel", () => events.push("cancel"));
		const first = { stop: vi.fn() };
		value.start(first);
		value.start({ stop: vi.fn() });
		expect(first.stop).toHaveBeenCalledOnce();
		expect(events).toEqual(["start", "cancel", "start"]);
		value.stop();
		expect(events.at(-1)).toBe("cancel");
		expect(value.isAnimating()).toBe(false);
	});

	it("announces the end of an animation that finishes", async () => {
		const value = motionValue(0);
		const complete = vi.fn();
		value.on("animationComplete", complete);
		value.start({ stop: vi.fn(), finished: Promise.resolve() });
		expect(value.isAnimating()).toBe(true);
		await Promise.resolve();
		expect(complete).toHaveBeenCalledOnce();
		expect(value.isAnimating()).toBe(false);
	});

	it("stays quiet when a replaced animation finishes later", async () => {
		const value = motionValue(0);
		const complete = vi.fn();
		value.on("animationComplete", complete);
		let resolve = () => {};
		value.start({
			stop: vi.fn(),
			finished: new Promise<void>((done) => {
				resolve = done;
			}),
		});
		value.start({ stop: vi.fn() });
		resolve();
		await Promise.resolve();
		expect(complete).not.toHaveBeenCalled();
	});

	it("drops its listeners on destroy", () => {
		const value = motionValue(0);
		const listener = vi.fn();
		value.on("change", listener);
		value.destroy();
		value.set(1);
		expect(listener).not.toHaveBeenCalled();
	});
});
