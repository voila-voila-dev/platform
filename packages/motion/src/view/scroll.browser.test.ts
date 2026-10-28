import { afterEach, describe, expect, it, vi } from "vitest";

import { type ScrollDrivable, scroll } from "#/view/scroll.ts";

function scroller(): { container: HTMLElement; item: HTMLElement } {
	const container = document.createElement("div");
	container.style.cssText = "height: 200px; overflow: auto";
	const spacer = document.createElement("div");
	spacer.style.height = "400px";
	const item = document.createElement("div");
	item.style.height = "100px";
	const after = document.createElement("div");
	after.style.height = "500px";
	// Content 1000 px, viewport 200 px: 800 px of scroll.
	container.append(spacer, item, after);
	document.body.append(container);
	return { container, item };
}

afterEach(() => {
	document.body.replaceChildren();
});

describe("scroll", () => {
	it("reports progress over the whole range", async () => {
		const { container } = scroller();
		const onScroll = vi.fn();
		const stop = scroll(onScroll, { container });
		await vi.waitFor(() =>
			expect(onScroll).toHaveBeenLastCalledWith(0, expect.anything()),
		);

		container.scrollTop = 400;
		await vi.waitFor(() =>
			expect(onScroll).toHaveBeenLastCalledWith(0.5, {
				progress: 0.5,
				scroll: 400,
				scrollLength: 800,
				axis: "y",
			}),
		);
		container.scrollTop = 800;
		await vi.waitFor(() =>
			expect(onScroll).toHaveBeenLastCalledWith(1, expect.anything()),
		);
		stop();
	});

	it("tracks a target from entering to leaving", async () => {
		const { container, item } = scroller();
		const onScroll = vi.fn();
		scroll(onScroll, { container, target: item });
		// Enters at 400 - 200 = 200, leaves at 500.
		container.scrollTop = 350;
		await vi.waitFor(() =>
			expect(onScroll).toHaveBeenLastCalledWith(0.5, expect.anything()),
		);
	});

	it("honours custom offsets", async () => {
		const { container, item } = scroller();
		const onScroll = vi.fn();
		scroll(onScroll, {
			container,
			target: item,
			offset: ["start end", "start start"],
		});
		// From 200 to 400.
		container.scrollTop = 300;
		await vi.waitFor(() =>
			expect(onScroll).toHaveBeenLastCalledWith(0.5, expect.anything()),
		);
	});

	it("drives an animation's time when it has no native timeline", async () => {
		const { container } = scroller();
		const controls: ScrollDrivable = { time: 0, duration: 2 };
		scroll(controls, { container });
		container.scrollTop = 200;
		await vi.waitFor(() => expect(controls.time).toBe(0.5));
	});

	it("falls back to the frame loop when the animation refuses the timeline", async () => {
		const { container } = scroller();
		const attachTimeline = vi.fn(() => false);
		const controls: ScrollDrivable = { time: 0, duration: 1, attachTimeline };
		scroll(controls, { container });
		container.scrollTop = 400;
		await vi.waitFor(() => expect(controls.time).toBe(0.5));
		expect(attachTimeline).toHaveBeenCalledTimes(
			"ScrollTimeline" in window ? 1 : 0,
		);
	});

	it.runIf("ScrollTimeline" in window)("hands a native timeline over", () => {
		const { container, item } = scroller();
		const attachTimeline = vi.fn((_timeline: AnimationTimeline) => true);
		const controls: ScrollDrivable = { time: 0, duration: 1, attachTimeline };
		scroll(controls, { container });
		expect(attachTimeline.mock.calls[0]?.[0]).toBeInstanceOf(
			(window as unknown as { ScrollTimeline: new () => object })
				.ScrollTimeline,
		);
		scroll(controls, { container, target: item });
		expect(attachTimeline.mock.calls[1]?.[0]).toBeInstanceOf(
			(window as unknown as { ViewTimeline: new () => object }).ViewTimeline,
		);
	});

	it("keeps the frame loop for offsets a bare timeline cannot express", () => {
		const { container, item } = scroller();
		const attachTimeline = vi.fn(() => true);
		scroll(
			{ time: 0, duration: 1, attachTimeline },
			{ container, target: item, offset: ["start end", "start start"] },
		);
		expect(attachTimeline).not.toHaveBeenCalled();
	});
});
