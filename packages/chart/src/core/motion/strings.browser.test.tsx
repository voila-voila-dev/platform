import { afterEach, describe, expect, it } from "vitest";
import { createColorResolver } from "#/canvas/resolve-color.ts";
import { colourBetween } from "#/core/motion/strings.ts";

afterEach(() => document.body.replaceChildren());

describe("a colour between two, in the browser", () => {
	const halfway = colourBetween("var(--from)", "var(--to)", 0.5);

	function host(): HTMLElement {
		const element = document.createElement("div");
		element.style.setProperty("--from", "rgb(255, 0, 0)");
		element.style.setProperty("--to", "rgb(0, 0, 255)");
		document.body.append(element);
		return element;
	}

	it("paints as an SVG fill attribute, chart tokens included", () => {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttribute("d", "M0 0 L10 0 L10 10 Z");
		path.setAttribute("fill", halfway);
		svg.append(path);
		host().append(svg);
		const fill = getComputedStyle(path).fill;
		expect(fill).not.toMatch(/^rgb\(0, 0, 0\)$|none/);
		expect(fill).not.toBe("rgb(255, 0, 0)");
		expect(fill).not.toBe("rgb(0, 0, 255)");
	});

	it("resolves for the Canvas renderer", () => {
		const resolver = createColorResolver(host());
		const resolved = resolver.resolve(halfway);
		expect(resolved).not.toMatch(/var\(|color-mix/);
		expect(resolved).not.toBe("rgb(255, 0, 0)");
		resolver.dispose();
	});
});
