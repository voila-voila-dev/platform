import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cancelFrame, frame, frameData, now } from "#/frame/frame.ts";
import { type ManualFrames, manualFrames } from "#/testing/manual-frames.ts";

let clock: ManualFrames;
beforeEach(() => {
	clock = manualFrames();
});
afterEach(() => clock.restore());

describe("frame", () => {
	it("runs read, then update, then render", () => {
		const order: string[] = [];
		frame.render(() => order.push("render"));
		frame.update(() => order.push("update"));
		frame.read(() => order.push("read"));
		clock.advance(16.7);
		expect(order).toEqual(["read", "update", "render"]);
	});

	it("runs a later phase this frame and the same phase next frame", () => {
		const order: string[] = [];
		frame.update(() => {
			order.push("update");
			frame.render(() => order.push("render, same frame"));
			frame.update(() => order.push("update, next frame"));
			frame.read(() => order.push("read, next frame"));
		});
		clock.advance(16.7);
		expect(order).toEqual(["update", "render, same frame"]);
		clock.advance(16.7);
		expect(order.slice(2)).toEqual(["read, next frame", "update, next frame"]);
	});

	it("keeps a keepAlive callback until it is cancelled", () => {
		let count = 0;
		const callback = frame.update(() => {
			count += 1;
		}, true);
		clock.advance(50);
		expect(count).toBe(3);
		cancelFrame(callback);
		clock.advance(50);
		expect(count).toBe(3);
	});

	it("cancels a callback scheduled for later in the running frame", () => {
		let ran = false;
		const late = frame.render(() => {
			ran = true;
		});
		frame.read(() => cancelFrame(late));
		clock.advance(16.7);
		expect(ran).toBe(false);
	});

	it("stops asking for frames when nothing is scheduled", () => {
		let frames = 0;
		frame.read(() => {
			frames += 1;
		});
		clock.advance(100);
		expect(frames).toBe(1);
	});

	it("hands every callback of a frame the same time", () => {
		const times: number[] = [];
		frame.read(() => times.push(now()));
		frame.render(() => times.push(now(), frameData().timestamp));
		clock.advance(16.7);
		expect(new Set(times).size).toBe(1);
		expect(frameData().delta).toBeCloseTo(1000 / 60);
	});

	it("measures the delta between consecutive frames", () => {
		frame.update(() => undefined, true);
		clock.advance(40);
		expect(frameData().delta).toBeCloseTo(1000 / 60);
	});
});
