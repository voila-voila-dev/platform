import { afterEach, describe, expect, it, vi } from "vitest";

import { inView } from "#/view/in-view.ts";

function scroller(): { container: HTMLElement; item: HTMLElement } {
	const container = document.createElement("div");
	container.style.cssText = "height: 200px; overflow: auto";
	const spacer = document.createElement("div");
	spacer.style.height = "600px";
	const item = document.createElement("div");
	item.style.cssText = "height: 100px";
	const after = document.createElement("div");
	after.style.height = "600px";
	container.append(spacer, item, after);
	document.body.append(container);
	return { container, item };
}

function nextFrames(): Promise<void> {
	return new Promise((resolve) =>
		requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
	);
}

afterEach(() => {
	document.body.replaceChildren();
});

describe("inView", () => {
	it("starts on entering and ends on leaving, then starts again", async () => {
		const { container, item } = scroller();
		const onEnd = vi.fn();
		const onStart = vi.fn((_element: Element) => onEnd);
		const stop = inView(item, onStart, { root: container });
		await nextFrames();
		expect(onStart).not.toHaveBeenCalled();

		container.scrollTop = 500;
		await vi.waitFor(() => expect(onStart).toHaveBeenCalledTimes(1));
		expect(onStart.mock.calls[0]?.[0]).toBe(item);

		container.scrollTop = 0;
		await vi.waitFor(() => expect(onEnd).toHaveBeenCalledTimes(1));

		container.scrollTop = 500;
		await vi.waitFor(() => expect(onStart).toHaveBeenCalledTimes(2));
		stop();
	});

	it("fires once when onStart returns nothing", async () => {
		const { container, item } = scroller();
		const onStart = vi.fn();
		inView(item, onStart, { root: container });
		container.scrollTop = 500;
		await vi.waitFor(() => expect(onStart).toHaveBeenCalledTimes(1));
		container.scrollTop = 0;
		await nextFrames();
		container.scrollTop = 500;
		await nextFrames();
		await nextFrames();
		expect(onStart).toHaveBeenCalledTimes(1);
	});

	it('waits for the whole element with amount "all"', async () => {
		const { container, item } = scroller();
		const onStart = vi.fn();
		inView(item, onStart, { root: container, amount: "all" });
		// 50 of its 100 px showing.
		container.scrollTop = 450;
		await nextFrames();
		await nextFrames();
		expect(onStart).not.toHaveBeenCalled();
		container.scrollTop = 550;
		await vi.waitFor(() => expect(onStart).toHaveBeenCalledTimes(1));
	});

	it("resolves a selector", async () => {
		const { container, item } = scroller();
		item.className = "watched";
		const onStart = vi.fn();
		inView(".watched", onStart, { root: container });
		container.scrollTop = 500;
		await vi.waitFor(() =>
			expect(onStart).toHaveBeenCalledWith(item, expect.anything()),
		);
	});
});
