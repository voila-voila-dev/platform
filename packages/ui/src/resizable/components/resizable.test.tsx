// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Resizable } from "#/resizable/components/resizable.tsx";

beforeEach(() => {
	// react-resizable-panels measures layout with ResizeObserver, absent in jsdom.
	vi.stubGlobal(
		"ResizeObserver",
		class {
			observe() {}
			unobserve() {}
			disconnect() {}
		},
	);
});

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

function renderGroup(
	props?: Partial<React.ComponentProps<typeof Resizable.PanelGroup>>,
	handleProps?: React.ComponentProps<typeof Resizable.Handle>,
) {
	return render(
		<Resizable.PanelGroup {...props}>
			<Resizable.Panel defaultSize={50}>
				<span>Project list</span>
			</Resizable.Panel>
			<Resizable.Handle {...handleProps} />
			<Resizable.Panel defaultSize={50}>
				<span>Project details</span>
			</Resizable.Panel>
		</Resizable.PanelGroup>,
	);
}

const queryGroup = (screen: ReturnType<typeof render>) =>
	screen.baseElement.querySelector("[data-slot=resizable-panel-group]");
const queryHandle = (screen: ReturnType<typeof render>) =>
	screen.baseElement.querySelector("[data-slot=resizable-handle]");

describe("Resizable.PanelGroup", () => {
	it("renders the group, panels and handle with their slots", () => {
		const screen = renderGroup();
		expect(queryGroup(screen)).toBeTruthy();
		expect(
			screen.baseElement.querySelectorAll("[data-slot=resizable-panel]"),
		).toHaveLength(2);
		expect(queryHandle(screen)).toBeTruthy();
		expect(screen.getByText("Project list")).toBeTruthy();
		expect(screen.getByText("Project details")).toBeTruthy();
	});

	it("merges className onto the group", () => {
		const screen = renderGroup({ className: "rounded-lg border" });
		const group = queryGroup(screen);
		expect(group?.classList.contains("rounded-lg")).toBe(true);
		expect(group?.classList.contains("border")).toBe(true);
	});

	it("carries no dead layout classes on the group", () => {
		// Regression: the library sets inline display/flex-direction/height/width,
		// so `flex h-full w-full aria-[orientation=vertical]:flex-col` never did
		// anything and were removed.
		const screen = renderGroup();
		const group = queryGroup(screen);
		for (const dead of [
			"flex",
			"h-full",
			"w-full",
			"aria-[orientation=vertical]:flex-col",
		]) {
			expect(group?.classList.contains(dead)).toBe(false);
		}
	});
});

describe("Resizable.Handle", () => {
	it("renders the grip only when withHandle is set", () => {
		const without = renderGroup(undefined, {});
		expect(
			without.baseElement.querySelector("[data-slot=resizable-handle-grip]"),
		).toBeNull();
		cleanup();

		const withGrip = renderGroup(undefined, { withHandle: true });
		expect(
			withGrip.baseElement.querySelector("[data-slot=resizable-handle-grip]"),
		).not.toBeNull();
	});

	it("drives the resting, hover and drag affordance off the library data-separator states", () => {
		// Regression: the drag/hover feedback must hang off `data-separator`
		// (which honours the wider hit area) rather than CSS `:hover`.
		const screen = renderGroup();
		const handle = queryHandle(screen);
		expect(
			handle?.classList.contains("data-[separator=hover]:after:bg-ring/40"),
		).toBe(true);
		expect(
			handle?.classList.contains("data-[separator=active]:after:bg-ring"),
		).toBe(true);
		// Wider hit area than the 1px line.
		expect(handle?.classList.contains("after:w-2")).toBe(true);
	});

	it("uses the kit-standard focus ring, not the drifted ring-1", () => {
		const screen = renderGroup();
		const handle = queryHandle(screen);
		expect(handle?.classList.contains("focus-visible:ring-3")).toBe(true);
		expect(handle?.classList.contains("focus-visible:ring-ring/50")).toBe(true);
		expect(handle?.classList.contains("focus-visible:ring-1")).toBe(false);
		// `ring-offset-background` was a no-op without a ring-offset width.
		expect(handle?.classList.contains("ring-offset-background")).toBe(false);
	});

	it("respects reduced motion on the animated affordance", () => {
		const screen = renderGroup();
		const handle = queryHandle(screen);
		expect(
			handle?.classList.contains("motion-reduce:after:transition-none"),
		).toBe(true);
	});

	it("merges className onto the handle", () => {
		const screen = renderGroup(undefined, { className: "bg-primary" });
		const handle = queryHandle(screen);
		expect(handle?.classList.contains("bg-primary")).toBe(true);
	});

	it("exposes the separator role with an orientation", () => {
		const screen = renderGroup();
		const handle = queryHandle(screen);
		// The library emits a separator with an aria-orientation (inverted from the
		// group: a horizontal group yields a vertical separator).
		expect(handle?.getAttribute("role")).toBe("separator");
		expect(handle?.getAttribute("aria-orientation")).toBe("vertical");
	});
});
