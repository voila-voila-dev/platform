import { afterEach, describe, expect, it, vi } from "vitest";

import { resize } from "#/view/resize.ts";

afterEach(() => {
	document.body.replaceChildren();
});

describe("resize", () => {
	it("reports an element's new border box", async () => {
		const box = document.createElement("div");
		box.style.cssText = "width: 100px; height: 50px; padding: 5px";
		document.body.append(box);
		const onResize = vi.fn();
		const stop = resize(box, onResize);
		await vi.waitFor(() => expect(onResize).toHaveBeenCalled());
		expect(onResize).toHaveBeenLastCalledWith(box, { width: 110, height: 60 });

		box.style.width = "200px";
		await vi.waitFor(() =>
			expect(onResize).toHaveBeenLastCalledWith(box, {
				width: 210,
				height: 60,
			}),
		);

		stop();
		const calls = onResize.mock.calls.length;
		box.style.width = "300px";
		await new Promise((resolve) => setTimeout(resolve, 50));
		expect(onResize).toHaveBeenCalledTimes(calls);
	});

	it("shares one element between several listeners", async () => {
		const box = document.createElement("div");
		document.body.append(box);
		const first = vi.fn();
		const second = vi.fn();
		const stopFirst = resize(box, first);
		resize(box, second);
		stopFirst();
		box.style.height = "40px";
		await vi.waitFor(() =>
			expect(second).toHaveBeenLastCalledWith(
				box,
				expect.objectContaining({ height: 40 }),
			),
		);
	});

	it("reports the window's size", () => {
		const onResize = vi.fn();
		const stop = resize(onResize);
		window.dispatchEvent(new Event("resize"));
		expect(onResize).toHaveBeenCalledWith({
			width: window.innerWidth,
			height: window.innerHeight,
		});
		stop();
	});
});
