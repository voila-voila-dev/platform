// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Icon, phosphorIconNames } from "#/icon/components/icon.tsx";

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

function queryIcon(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector("svg[data-slot=icon]");
}

describe("Icon", () => {
	it("renders the named Phosphor icon as an svg", () => {
		const screen = render(<Icon name="HeartbeatIcon" />);
		const icon = queryIcon(screen);
		expect(icon).not.toBeNull();
		expect(icon?.tagName.toLowerCase()).toBe("svg");
	});

	it("forwards size to the svg dimensions in pixels", () => {
		const screen = render(<Icon name="HeartbeatIcon" size={28} />);
		const icon = queryIcon(screen);
		expect(icon?.getAttribute("width")).toBe("28");
		expect(icon?.getAttribute("height")).toBe("28");
	});

	it("falls back to the TagIcon markup for unknown names", () => {
		vi.spyOn(console, "warn").mockImplementation(() => {});
		const unknown = render(
			<Icon name="NotARealIconName" size={24} />,
		).container.querySelector("svg[data-slot=icon]");
		const tag = render(
			<Icon name="TagIcon" size={24} />,
		).container.querySelector("svg[data-slot=icon]");
		expect(unknown?.innerHTML).toBe(tag?.innerHTML);
	});

	it("warns in dev when the name is unknown", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		render(<Icon name="NotARealIconName" />);
		expect(warn).toHaveBeenCalledOnce();
		expect(warn.mock.calls[0]?.[0]).toContain("NotARealIconName");
	});

	it("does not warn for known names", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		render(<Icon name="HeartbeatIcon" />);
		expect(warn).not.toHaveBeenCalled();
	});

	it("never renders non-icon namespace exports like IconContext", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		const screen = render(<Icon name="IconContext" />);
		const fallback = render(<Icon name="TagIcon" />).container.querySelector(
			"svg[data-slot=icon]",
		);
		expect(
			screen.container.querySelector("svg[data-slot=icon]")?.innerHTML,
		).toBe(fallback?.innerHTML);
		expect(warn).toHaveBeenCalledOnce();
	});

	it("is aria-hidden by default for decorative usage", () => {
		const screen = render(<Icon name="HeartbeatIcon" />);
		expect(queryIcon(screen)?.getAttribute("aria-hidden")).toBe("true");
	});

	it("stays visible to assistive tech when labelled", () => {
		const labelled = render(
			<Icon name="HeartbeatIcon" aria-label="Heartbeat" />,
		).container.querySelector("svg[data-slot=icon]");
		expect(labelled?.getAttribute("aria-hidden")).toBeNull();
		expect(labelled?.getAttribute("aria-label")).toBe("Heartbeat");
		const withAlt = render(
			<Icon name="HeartbeatIcon" alt="Heartbeat" />,
		).container.querySelector("svg[data-slot=icon]");
		expect(withAlt?.getAttribute("aria-hidden")).toBeNull();
	});

	it("lets consumers override aria-hidden explicitly", () => {
		const screen = render(<Icon name="HeartbeatIcon" aria-hidden={false} />);
		expect(queryIcon(screen)?.getAttribute("aria-hidden")).toBe("false");
	});

	it("passes color and className through to the svg", () => {
		const screen = render(
			<Icon name="HeartbeatIcon" color="red" className="custom-icon-class" />,
		);
		const icon = queryIcon(screen);
		expect(icon?.getAttribute("fill")).toBe("red");
		expect(icon?.classList.contains("custom-icon-class")).toBe(true);
	});
});

describe("phosphorIconNames", () => {
	it("only lists *Icon component exports, sorted", () => {
		expect(phosphorIconNames.length).toBeGreaterThan(1000);
		expect(phosphorIconNames).toContain("HeartIcon");
		expect(phosphorIconNames).not.toContain("IconContext");
		expect(phosphorIconNames).not.toContain("IconBase");
		for (const name of phosphorIconNames) {
			expect(name.endsWith("Icon")).toBe(true);
		}
		expect([...phosphorIconNames].sort()).toEqual([...phosphorIconNames]);
	});
});
