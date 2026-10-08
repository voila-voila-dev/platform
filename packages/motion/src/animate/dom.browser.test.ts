import { afterEach, describe, expect, it } from "vitest";
import { commands } from "vitest/browser";
import { animate } from "#/animate/animate.ts";
import { animate as animateDom } from "#/dom.ts";
import { scroll } from "#/view/scroll.ts";

function box(): HTMLElement {
	const element = document.createElement("div");
	element.style.cssText = "width: 40px; height: 40px; background: red;";
	document.body.append(element);
	return element;
}

/** The painted horizontal offset: what a reader sees, animations included. */
function translateX(element: Element): number {
	const value = getComputedStyle(element).translate;
	return value === "none" ? 0 : Number.parseFloat(value);
}

function nextFrame(): Promise<number> {
	return new Promise((resolve) => requestAnimationFrame(resolve));
}

afterEach(async () => {
	document.body.replaceChildren();
	await commands.emulateMedia({ reducedMotion: null });
});

describe("animate on elements", () => {
	it("hands the animation to the browser and leaves the end value inline", async () => {
		const element = box();
		const controls = animate(element, { opacity: [0, 1] }, { duration: 0.1 });
		const [animation] = element.getAnimations();
		expect(animation).toBeDefined();
		expect(
			((animation as Animation).effect as KeyframeEffect).getTiming().easing,
		).toMatch(/^linear\(/);
		await controls;
		expect(element.getAnimations()).toHaveLength(0);
		expect(element.style.opacity).toBe("1");
	});

	it("plays x and y as two composited animations that add up", async () => {
		const element = box();
		const controls = animate(element, { x: 100, y: 50 }, { duration: 0.2 });
		const effects = element
			.getAnimations()
			.map((animation) => animation.effect as KeyframeEffect);
		expect(effects.map((effect) => effect.composite)).toEqual(["add", "add"]);
		await controls;
		expect(getComputedStyle(element).translate).toBe("100px 50px");
	});

	it("tilts and skews through transform, added on top of the rest", async () => {
		const element = box();
		const controls = animate(
			element,
			{ rotateX: 40, rotateY: 30, skewX: 10, x: 20 },
			{ duration: 0.2 },
		);
		const effects = element
			.getAnimations()
			.map((animation) => animation.effect as KeyframeEffect);
		expect(effects.every((effect) => effect.composite === "add")).toBe(true);
		const mid = effects.find((effect) =>
			String(effect.getKeyframes().at(-1)?.transform).startsWith("rotateX"),
		);
		expect(mid?.getKeyframes().at(-1)?.transform).toBe("rotateX(40deg)");
		await controls;
		expect(element.style.transform).toBe(
			"rotateX(40deg) rotateY(30deg) skew(0deg) skewX(10deg) skewY(0deg)",
		);
		expect(getComputedStyle(element).translate).toBe("20px");
	});

	it("leaves transform to the page on an element that only moves", async () => {
		const element = box();
		element.style.transform = "scale(2)";
		await animate(element, { x: 10 }, { duration: 0.05 });
		expect(element.style.transform).toBe("scale(2)");
	});

	it("snaps a skew under reduced motion", async () => {
		await commands.emulateMedia({ reducedMotion: "reduce" });
		const element = box();
		await animate(element, { skew: 15 }, { duration: 0.2 });
		expect(element.style.transform).toContain("skew(15deg)");
	});

	it("plays backwards in the browser and leaves the first keyframe", async () => {
		const element = box();
		const controls = animate(
			element,
			{ opacity: [0.2, 1], x: [0, 100] },
			{ type: "tween", duration: 0.4 },
		);
		await new Promise((resolve) => setTimeout(resolve, 100));
		controls.speed = -1;
		await controls;
		expect(element.style.opacity).toBe("0.2");
		expect(translateX(element)).toBe(0);
	});

	it("can be interrupted mid-flight without a jump", async () => {
		const element = box();
		animate(element, { x: 300 }, { duration: 0.8 });
		await new Promise((resolve) => setTimeout(resolve, 150));
		await nextFrame();
		const before = translateX(element);
		expect(before).toBeGreaterThan(10);
		const controls = animate(element, { x: 0 }, { duration: 0.8 });
		const after = translateX(element);
		// Still heading right: the spring kept the speed it had, it did not restart from rest.
		await nextFrame();
		await nextFrame();
		const later = translateX(element);
		expect(Math.abs(after - before)).toBeLessThan(15);
		expect(later).toBeGreaterThanOrEqual(after - 1);
		controls.complete();
		await controls;
		expect(translateX(element)).toBe(0);
	});

	it("snaps movement and still fades under reduced motion", async () => {
		await commands.emulateMedia({ reducedMotion: "reduce" });
		const element = box();
		const controls = animate(
			element,
			{ x: 100, opacity: [0, 1] },
			{ duration: 0.2 },
		);
		expect(translateX(element)).toBe(100);
		expect(element.getAnimations()).toHaveLength(1);
		await controls;
		expect(element.style.opacity).toBe("1");
	});

	it("stops where it is and cancels back to the start", async () => {
		const element = box();
		const stopped = animate(element, { x: [0, 200] }, { duration: 1 });
		await new Promise((resolve) => setTimeout(resolve, 200));
		stopped.stop();
		const held = translateX(element);
		expect(held).toBeGreaterThan(0);
		expect(held).toBeLessThan(200);
		const cancelled = animate(element, { x: [0, 200] }, { duration: 1 });
		cancelled.cancel();
		expect(translateX(element)).toBe(0);
	});

	it("animates a CSS variable and morphs an SVG path in JavaScript", async () => {
		const element = box();
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttribute("d", "M0 0 L10 0 L10 10 L0 10 Z");
		svg.append(path);
		document.body.append(svg);
		const triangle = "M0 0 L10 10 L0 10 Z";
		const controls = animate(
			path,
			{ d: triangle },
			{ type: "tween", duration: 0.1 },
		);
		const variable = animate(
			element,
			{ "--progress": [0, 1] },
			{ type: "tween", duration: 0.1 },
		);
		await Promise.all([controls, variable]);
		expect(path.getAttribute("d")).toBe(triangle);
		expect(element.style.getPropertyValue("--progress")).toBe("1");
	});

	it("staggers the elements a selector names", async () => {
		box().className = "item";
		box().className = "item";
		const controls = animate(
			".item",
			{ opacity: [0, 1] },
			{ duration: 0.1, delay: (index) => index * 0.1 },
		);
		const delays = Array.from(document.querySelectorAll(".item")).map(
			(element) =>
				(
					(element.getAnimations()[0] as Animation).effect as KeyframeEffect
				).getTiming().delay,
		);
		expect(delays).toEqual([0, 100]);
		await controls;
	});
});

describe("edge cases", () => {
	it("starts from where a stopped animation was held, not from its start", async () => {
		const element = box();
		const first = animate(element, { x: 200 }, { duration: 1 });
		await new Promise((resolve) => setTimeout(resolve, 200));
		first.stop();
		const held = translateX(element);
		expect(held).toBeGreaterThan(10);
		animate(element, { x: 400 }, { duration: 1 });
		expect(Math.abs(translateX(element) - held)).toBeLessThan(2);
	});

	it("animates an array of named form elements instead of reading it as a sequence", async () => {
		const buttons = [
			document.createElement("button"),
			document.createElement("button"),
		];
		document.body.append(...buttons);
		const controls = animate(buttons, { opacity: [1, 0] }, { duration: 0.05 });
		expect(buttons[0]?.getAnimations()).toHaveLength(1);
		await controls;
		expect(buttons[1]?.style.opacity).toBe("0");
	});

	it("completes an animation that repeats forever", async () => {
		const element = box();
		const controls = animate(
			element,
			{ opacity: [0, 1] },
			{ duration: 0.1, repeat: Number.POSITIVE_INFINITY },
		);
		expect(() => controls.complete()).not.toThrow();
		await controls;
		expect(element.getAnimations()).toHaveLength(0);
	});
});

describe("the dom entry", () => {
	it("animates with the browser and jumps what it can't hand over", async () => {
		const element = box();
		const controls = animateDom(
			element,
			{ scale: [0.5, 1], "--progress": 1 },
			{ duration: 0.1 },
		);
		expect(element.style.getPropertyValue("--progress")).toBe("1");
		expect(element.getAnimations()).toHaveLength(1);
		await controls;
		expect(getComputedStyle(element).scale).toBe("1");
	});
});

describe("scroll-linked", () => {
	it("hands a scroll timeline to the browser animation", () => {
		const container = document.createElement("div");
		container.style.cssText = "height: 100px; overflow: auto;";
		const content = box();
		content.style.height = "400px";
		container.append(content);
		document.body.append(container);
		const controls = animate(content, { opacity: [0, 1] }, { duration: 1 });
		scroll(controls, { container });
		const [animation] = content.getAnimations();
		expect(animation?.timeline).toBeInstanceOf(ScrollTimeline);
	});
});
