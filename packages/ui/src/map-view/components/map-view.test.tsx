// @vitest-environment jsdom
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MapView as LazyMapView } from "#/map-view/components/map-view.tsx";
// The public `MapView` defers this module through `React.lazy`, so the
// behavioral suite drives the implementation directly (synchronous mount);
// the lazy shell gets its own suite at the bottom.
import { MapViewImplementation as MapView } from "#/map-view/components/map-view-implementation.tsx";
import {
	DEFAULT_DARK_STYLE_URL,
	DEFAULT_STYLE_URL,
} from "#/map-view/lib/style-urls.ts";

/**
 * Controllable MapLibre stand-in: jsdom has no WebGL, so the real constructor
 * always throws. The fake lets each test pick the failure path (`shouldThrow`)
 * or drive the success path (inspect constructor options, fire `load`/`moveend`).
 */
const mapLibre = vi.hoisted(() => {
	const state = {
		shouldThrow: false,
		instances: [] as FakeMap[],
	};
	class FakeMap {
		readonly options: Record<string, unknown>;
		readonly handlers = new Map<string, () => void>();
		readonly onceHandlers = new Map<string, () => void>();
		readonly addControl = vi.fn();
		readonly resize = vi.fn();
		readonly remove = vi.fn();
		readonly setStyle = vi.fn();
		constructor(options: Record<string, unknown>) {
			if (state.shouldThrow) {
				throw new Error("Failed to initialize WebGL");
			}
			this.options = options;
			state.instances.push(this);
		}
		isStyleLoaded() {
			return false;
		}
		once(event: string, handler: () => void) {
			this.onceHandlers.set(event, handler);
		}
		on(event: string, handler: () => void) {
			this.handlers.set(event, handler);
		}
		getBounds() {
			return {
				getWest: () => -5,
				getSouth: () => 41,
				getEast: () => 10,
				getNorth: () => 51,
			};
		}
		getZoom() {
			return 7;
		}
	}
	return { state, FakeMap };
});

vi.mock("maplibre-gl", () => ({
	default: {
		Map: mapLibre.FakeMap,
		NavigationControl: class NavigationControl {},
	},
}));
vi.mock("maplibre-gl/dist/maplibre-gl.css", () => ({}));

class FakeResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}
vi.stubGlobal("ResizeObserver", FakeResizeObserver);

const matchMediaMatches = { reducedMotion: false };
vi.stubGlobal("matchMedia", (query: string) => ({
	matches:
		query.includes("prefers-reduced-motion") && matchMediaMatches.reducedMotion,
	media: query,
	addEventListener: () => {},
	removeEventListener: () => {},
}));

beforeEach(() => {
	mapLibre.state.shouldThrow = false;
	mapLibre.state.instances = [];
	matchMediaMatches.reducedMotion = false;
});

afterEach(() => {
	document.documentElement.classList.remove("dark");
	cleanup();
});

/** MutationObserver callbacks are queued as microtasks; let them run. */
async function flushThemeObserver() {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
	});
}

function queryMapView(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector("[data-slot=map-view]");
}

function lastInstance() {
	const instance = mapLibre.state.instances.at(-1);
	if (instance === undefined) {
		throw new Error("no MapLibre instance was constructed");
	}
	return instance;
}

describe("MapView", () => {
	it("renders a wrapper div with its slot attribute and surface classes", () => {
		const screen = render(<MapView />);
		const wrapper = queryMapView(screen);
		expect(wrapper?.tagName).toBe("DIV");
		expect(wrapper?.classList.contains("rounded-lg")).toBe(true);
		expect(wrapper?.classList.contains("border")).toBe(true);
		expect(wrapper?.classList.contains("border-input")).toBe(false);
	});

	it("merges className over the defaults", () => {
		const screen = render(<MapView className="h-96" />);
		const wrapper = queryMapView(screen);
		expect(wrapper?.classList.contains("h-96")).toBe(true);
		expect(wrapper?.classList.contains("h-[70vh]")).toBe(false);
		expect(wrapper?.classList.contains("overflow-hidden")).toBe(true);
	});

	it("passes native div props through to the wrapper", () => {
		const screen = render(
			<MapView aria-label="Map of clients" data-testid="admin-map" />,
		);
		const wrapper = queryMapView(screen);
		expect(wrapper?.getAttribute("aria-label")).toBe("Map of clients");
		expect(wrapper?.getAttribute("data-testid")).toBe("admin-map");
	});

	it("defaults to the light basemap style", () => {
		render(<MapView />);
		expect(lastInstance().options.style).toBe(DEFAULT_STYLE_URL);
	});

	it("defaults to the dark basemap style inside a .dark subtree", () => {
		render(
			<div className="dark">
				<MapView />
			</div>,
		);
		expect(lastInstance().options.style).toBe(DEFAULT_DARK_STYLE_URL);
	});

	it("prefers an explicit styleUrl over the theme defaults", () => {
		render(
			<div className="dark">
				<MapView styleUrl="https://example.com/style.json" />
			</div>,
		);
		expect(lastInstance().options.style).toBe("https://example.com/style.json");
	});

	it("restyles to the dark basemap when the .dark class lands after mount", async () => {
		render(<MapView />);
		expect(lastInstance().options.style).toBe(DEFAULT_STYLE_URL);
		document.documentElement.classList.add("dark");
		await flushThemeObserver();
		expect(lastInstance().setStyle).toHaveBeenCalledWith(
			DEFAULT_DARK_STYLE_URL,
		);
	});

	it("restyles back to the light basemap when the .dark class is removed", async () => {
		document.documentElement.classList.add("dark");
		render(<MapView />);
		expect(lastInstance().options.style).toBe(DEFAULT_DARK_STYLE_URL);
		document.documentElement.classList.remove("dark");
		await flushThemeObserver();
		expect(lastInstance().setStyle).toHaveBeenCalledWith(DEFAULT_STYLE_URL);
	});

	it("ignores theme switches when an explicit styleUrl is set", async () => {
		render(<MapView styleUrl="https://example.com/style.json" />);
		document.documentElement.classList.add("dark");
		await flushThemeObserver();
		expect(lastInstance().setStyle).not.toHaveBeenCalled();
	});

	it("ignores class churn that does not change the resolved theme", async () => {
		render(<MapView />);
		document.documentElement.classList.add("some-other-class");
		await flushThemeObserver();
		expect(lastInstance().setStyle).not.toHaveBeenCalled();
	});

	it("replays onReady and onMoveEnd once the swapped style loads", async () => {
		const onReady = vi.fn();
		const onMoveEnd = vi.fn();
		render(<MapView onReady={onReady} onMoveEnd={onMoveEnd} />);
		act(() => lastInstance().onceHandlers.get("load")?.());
		expect(onReady).toHaveBeenCalledTimes(1);
		document.documentElement.classList.add("dark");
		await flushThemeObserver();
		act(() => lastInstance().onceHandlers.get("style.load")?.());
		expect(onReady).toHaveBeenCalledTimes(2);
		expect(onMoveEnd).toHaveBeenCalledTimes(2);
	});

	it("stops following theme switches after unmount", async () => {
		const screen = render(<MapView />);
		const instance = lastInstance();
		screen.unmount();
		document.documentElement.classList.add("dark");
		await flushThemeObserver();
		expect(instance.setStyle).not.toHaveBeenCalled();
	});

	it("forwards extra MapLibre options to the constructor", () => {
		render(<MapView options={{ attributionControl: false, maxZoom: 12 }} />);
		const options = lastInstance().options;
		expect(options.attributionControl).toBe(false);
		expect(options.maxZoom).toBe(12);
	});

	it("disables tile crossfades under prefers-reduced-motion", () => {
		matchMediaMatches.reducedMotion = true;
		render(<MapView />);
		expect(lastInstance().options.fadeDuration).toBe(0);
	});

	it("leaves tile crossfades alone without the preference", () => {
		render(<MapView />);
		expect("fadeDuration" in lastInstance().options).toBe(false);
	});

	it("pulses the canvas as a loading placeholder until the style loads", () => {
		const screen = render(<MapView />);
		const canvas = screen.baseElement.querySelector(
			"[data-slot=map-view-canvas]",
		);
		expect(canvas?.getAttribute("data-loaded")).toBe("false");
		act(() => lastInstance().onceHandlers.get("load")?.());
		expect(canvas?.getAttribute("data-loaded")).toBe("true");
	});

	it("preserves classes MapLibre adds to the container across the load transition", () => {
		// MapLibre adds `maplibregl-map` (relative positioning + overflow
		// clipping) to the container imperatively; if React rewrites className
		// when `loaded` flips, the map escapes its box.
		const screen = render(<MapView />);
		const canvas = screen.baseElement.querySelector(
			"[data-slot=map-view-canvas]",
		);
		canvas?.classList.add("maplibregl-map");
		act(() => lastInstance().onceHandlers.get("load")?.());
		expect(canvas?.classList.contains("maplibregl-map")).toBe(true);
	});

	it("calls onReady and an initial onMoveEnd once loaded", () => {
		const onReady = vi.fn();
		const onMoveEnd = vi.fn();
		render(<MapView onReady={onReady} onMoveEnd={onMoveEnd} />);
		expect(onReady).not.toHaveBeenCalled();
		act(() => lastInstance().onceHandlers.get("load")?.());
		expect(onReady).toHaveBeenCalledWith(lastInstance());
		expect(onMoveEnd).toHaveBeenCalledWith(
			{ west: -5, south: 41, east: 10, north: 51 },
			7,
		);
	});

	it("reports bounds and zoom on every moveend", () => {
		const onMoveEnd = vi.fn();
		render(<MapView onMoveEnd={onMoveEnd} />);
		act(() => lastInstance().handlers.get("moveend")?.());
		expect(onMoveEnd).toHaveBeenCalledTimes(1);
		expect(onMoveEnd).toHaveBeenCalledWith(
			{ west: -5, south: 41, east: 10, north: 51 },
			7,
		);
	});

	it("removes the map instance on unmount", () => {
		const screen = render(<MapView />);
		const instance = lastInstance();
		screen.unmount();
		expect(instance.remove).toHaveBeenCalledTimes(1);
	});

	it("renders the fallback when the basemap cannot initialize", () => {
		mapLibre.state.shouldThrow = true;
		const screen = render(
			<MapView unavailableFallback="La carte est indisponible." />,
		);
		const fallback = screen.baseElement.querySelector(
			"[data-slot=map-view-fallback]",
		);
		expect(fallback?.textContent).toBe("La carte est indisponible.");
		expect(
			screen.baseElement.querySelector("[data-slot=map-view-canvas]"),
		).toBeNull();
	});
});

describe("MapView (lazy shell)", () => {
	it("renders a matching skeleton while the MapLibre chunk loads, then the map", async () => {
		const screen = render(<LazyMapView className="h-96" />);
		const shell = queryMapView(screen);
		expect(shell?.classList.contains("h-96")).toBe(true);
		expect(
			screen.baseElement.querySelector("[data-slot=skeleton]"),
		).not.toBeNull();
		expect(
			screen.baseElement.querySelector("[data-slot=map-view-canvas]"),
		).toBeNull();
		// Let the dynamic import settle; the real component then replaces the
		// skeleton and constructs the (mocked) MapLibre instance.
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});
		expect(screen.baseElement.querySelector("[data-slot=skeleton]")).toBeNull();
		const canvas = screen.baseElement.querySelector(
			"[data-slot=map-view-canvas]",
		);
		expect(canvas).not.toBeNull();
		expect(queryMapView(screen)?.classList.contains("h-96")).toBe(true);
		expect(lastInstance().options.style).toBe(DEFAULT_STYLE_URL);
	});
});
