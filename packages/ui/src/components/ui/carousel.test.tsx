// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselDots,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	useCarousel,
} from "#/components/ui/carousel.tsx";

const matchMediaMatches = { reducedMotion: false };

// Embla derives scroll snaps from offset* layout properties, which jsdom
// leaves at 0. Pretend every element is 100px and slides sit side by side
// so a 3-slide carousel produces 3 distinct snap points.
const offsetFromSiblingIndex = {
	configurable: true,
	get(this: HTMLElement) {
		const parent = this.parentElement;
		if (!parent) return 0;
		return Array.prototype.indexOf.call(parent.children, this) * 100;
	},
};
const layoutPropertyOverrides: PropertyDescriptorMap = {
	offsetWidth: {
		configurable: true,
		get() {
			return 100;
		},
	},
	offsetHeight: {
		configurable: true,
		get() {
			return 100;
		},
	},
	offsetLeft: offsetFromSiblingIndex,
	offsetTop: offsetFromSiblingIndex,
};
const originalLayoutDescriptors = Object.fromEntries(
	Object.keys(layoutPropertyOverrides).map((property) => [
		property,
		Object.getOwnPropertyDescriptor(HTMLElement.prototype, property),
	]),
);

beforeEach(() => {
	Object.defineProperties(HTMLElement.prototype, layoutPropertyOverrides);
	// Embla measures slides with ResizeObserver and tracks visibility with
	// IntersectionObserver, both absent in jsdom.
	class ObserverStub {
		observe() {}
		unobserve() {}
		disconnect() {}
		takeRecords() {
			return [];
		}
	}
	vi.stubGlobal("ResizeObserver", ObserverStub);
	vi.stubGlobal("IntersectionObserver", ObserverStub);
	vi.stubGlobal("matchMedia", (query: string) => ({
		matches:
			query.includes("prefers-reduced-motion") &&
			matchMediaMatches.reducedMotion,
		media: query,
		addEventListener: () => {},
		removeEventListener: () => {},
		addListener: () => {},
		removeListener: () => {},
		dispatchEvent: () => false,
	}));
});

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
	matchMediaMatches.reducedMotion = false;
	for (const [property, descriptor] of Object.entries(
		originalLayoutDescriptors,
	)) {
		if (descriptor) {
			Object.defineProperty(HTMLElement.prototype, property, descriptor);
		} else {
			Reflect.deleteProperty(HTMLElement.prototype, property);
		}
	}
});

function renderCarousel(
	props: React.ComponentProps<typeof Carousel> = {},
	options: { withDots?: boolean } = {},
) {
	let capturedApi: CarouselApi;
	const screen = render(
		<Carousel
			{...props}
			setApi={(api) => {
				capturedApi = api;
				props.setApi?.(api);
			}}
		>
			<CarouselContent>
				{[1, 2, 3].map((slideNumber) => (
					<CarouselItem key={slideNumber}>Slide {slideNumber}</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
			{options.withDots ? <CarouselDots /> : null}
		</Carousel>,
	);
	return {
		screen,
		api: (): NonNullable<CarouselApi> => {
			if (!capturedApi) {
				throw new Error("Embla api was not initialized");
			}
			return capturedApi;
		},
	};
}

describe("Carousel", () => {
	it("renders a region with the carousel roledescription", () => {
		const { screen } = renderCarousel();
		const root = screen.baseElement.querySelector("[data-slot=carousel]");
		expect(root?.getAttribute("role")).toBe("region");
		expect(root?.getAttribute("aria-roledescription")).toBe("carousel");
	});

	it("stamps data-orientation=horizontal on every layer by default", () => {
		const { screen } = renderCarousel();
		for (const slot of [
			"carousel",
			"carousel-content",
			"carousel-track",
			"carousel-item",
			"carousel-previous",
			"carousel-next",
		]) {
			const element = screen.baseElement.querySelector(`[data-slot=${slot}]`);
			expect(element?.getAttribute("data-orientation")).toBe("horizontal");
		}
	});

	it("stamps data-orientation=vertical when orientation is vertical", () => {
		const { screen } = renderCarousel({ orientation: "vertical" });
		for (const slot of [
			"carousel",
			"carousel-track",
			"carousel-item",
			"carousel-previous",
			"carousel-next",
		]) {
			const element = screen.baseElement.querySelector(`[data-slot=${slot}]`);
			expect(element?.getAttribute("data-orientation")).toBe("vertical");
		}
	});

	it("styles orientation through data-attribute variants, not inline ternaries", () => {
		const { screen } = renderCarousel();
		const track = screen.baseElement.querySelector(
			"[data-slot=carousel-track]",
		);
		expect(
			track?.classList.contains("data-[orientation=horizontal]:-ml-4"),
		).toBe(true);
		const item = screen.baseElement.querySelector("[data-slot=carousel-item]");
		expect(item?.classList.contains("data-[orientation=horizontal]:pl-4")).toBe(
			true,
		);
	});

	it("renders slides as groups with the slide roledescription", () => {
		const { screen } = renderCarousel();
		const items = screen.baseElement.querySelectorAll(
			"[data-slot=carousel-item]",
		);
		expect(items.length).toBe(3);
		for (const item of items) {
			expect(item.getAttribute("role")).toBe("group");
			expect(item.getAttribute("aria-roledescription")).toBe("slide");
		}
	});

	it("merges className on the root", () => {
		const screen = render(
			<Carousel className="custom-carousel">
				<CarouselContent>
					<CarouselItem>Slide</CarouselItem>
				</CarouselContent>
			</Carousel>,
		);
		const root = screen.baseElement.querySelector("[data-slot=carousel]");
		expect(root?.classList.contains("custom-carousel")).toBe(true);
		expect(root?.classList.contains("relative")).toBe(true);
	});

	it("exposes both content layers: containerClassName on the viewport, className on the track", () => {
		const screen = render(
			<Carousel>
				<CarouselContent
					containerClassName="custom-viewport"
					className="custom-track"
				>
					<CarouselItem>Slide</CarouselItem>
				</CarouselContent>
			</Carousel>,
		);
		const viewport = screen.baseElement.querySelector(
			"[data-slot=carousel-content]",
		);
		expect(viewport?.classList.contains("custom-viewport")).toBe(true);
		expect(viewport?.classList.contains("overflow-hidden")).toBe(true);
		const track = screen.baseElement.querySelector(
			"[data-slot=carousel-track]",
		);
		expect(track?.classList.contains("custom-track")).toBe(true);
	});

	it("throws when useCarousel is used outside a Carousel", () => {
		function Orphan() {
			useCarousel();
			return null;
		}
		expect(() => render(<Orphan />)).toThrow(
			"useCarousel must be used within a <Carousel />",
		);
	});
});

describe("Carousel keyboard navigation", () => {
	it("scrolls with ArrowLeft/ArrowRight when horizontal", () => {
		const { screen, api } = renderCarousel();
		const scrollPrev = vi.spyOn(api(), "scrollPrev");
		const scrollNext = vi.spyOn(api(), "scrollNext");
		const root = screen.getByRole("region");

		fireEvent.keyDown(root, { key: "ArrowRight" });
		expect(scrollNext).toHaveBeenCalledTimes(1);
		fireEvent.keyDown(root, { key: "ArrowLeft" });
		expect(scrollPrev).toHaveBeenCalledTimes(1);
	});

	it("scrolls with ArrowUp/ArrowDown when vertical and ignores left/right", () => {
		const { screen, api } = renderCarousel({ orientation: "vertical" });
		const scrollPrev = vi.spyOn(api(), "scrollPrev");
		const scrollNext = vi.spyOn(api(), "scrollNext");
		const root = screen.getByRole("region");

		fireEvent.keyDown(root, { key: "ArrowDown" });
		expect(scrollNext).toHaveBeenCalledTimes(1);
		fireEvent.keyDown(root, { key: "ArrowUp" });
		expect(scrollPrev).toHaveBeenCalledTimes(1);

		fireEvent.keyDown(root, { key: "ArrowRight" });
		fireEvent.keyDown(root, { key: "ArrowLeft" });
		expect(scrollNext).toHaveBeenCalledTimes(1);
		expect(scrollPrev).toHaveBeenCalledTimes(1);
	});
});

describe("Carousel reduced motion", () => {
	it("jumps instantly when prefers-reduced-motion is set", () => {
		matchMediaMatches.reducedMotion = true;
		const { screen, api } = renderCarousel();
		const scrollNext = vi.spyOn(api(), "scrollNext");
		const root = screen.getByRole("region");

		fireEvent.keyDown(root, { key: "ArrowRight" });
		expect(scrollNext).toHaveBeenCalledWith(true);
	});

	it("animates by default", () => {
		const { screen, api } = renderCarousel();
		const scrollNext = vi.spyOn(api(), "scrollNext");
		const root = screen.getByRole("region");

		fireEvent.keyDown(root, { key: "ArrowRight" });
		expect(scrollNext).toHaveBeenCalledWith(false);
	});
});

describe("Carousel listener cleanup", () => {
	it("removes both reInit and select listeners on unmount", () => {
		const { screen, api } = renderCarousel();
		const off = vi.spyOn(api(), "off");

		screen.unmount();
		const removedEvents = off.mock.calls.map(([eventName]) => eventName);
		expect(removedEvents).toContain("reInit");
		expect(removedEvents).toContain("select");
	});
});

describe("CarouselPrevious / CarouselNext", () => {
	it("places buttons outside the viewport by default and inside with inset", () => {
		const screen = render(
			<Carousel>
				<CarouselContent>
					<CarouselItem>Slide</CarouselItem>
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext inset />
			</Carousel>,
		);
		const previous = screen.baseElement.querySelector(
			"[data-slot=carousel-previous]",
		);
		expect(
			previous?.classList.contains("data-[orientation=horizontal]:-left-12"),
		).toBe(true);
		const next = screen.baseElement.querySelector("[data-slot=carousel-next]");
		expect(
			next?.classList.contains("data-[orientation=horizontal]:right-2"),
		).toBe(true);
	});

	it("merges className and keeps the screen-reader labels", () => {
		const { screen } = renderCarousel();
		const previous = screen.baseElement.querySelector(
			"[data-slot=carousel-previous]",
		);
		const next = screen.baseElement.querySelector("[data-slot=carousel-next]");
		expect(previous?.textContent).toContain("Previous slide");
		expect(next?.textContent).toContain("Next slide");
	});
});

describe("CarouselDots", () => {
	it("renders one dot per scroll snap with the selected dot active", () => {
		const { screen } = renderCarousel({}, { withDots: true });
		const dots = screen.baseElement.querySelectorAll(
			"[data-slot=carousel-dot]",
		);
		expect(dots.length).toBe(3);
		expect(dots[0]?.getAttribute("data-state")).toBe("active");
		expect(dots[0]?.getAttribute("aria-current")).toBe("true");
		expect(dots[1]?.getAttribute("data-state")).toBe("inactive");
		expect(dots[0]?.getAttribute("aria-label")).toBe("Go to slide 1");
	});

	it("scrolls to the matching snap when a dot is clicked", () => {
		const { screen, api } = renderCarousel({}, { withDots: true });
		const scrollTo = vi.spyOn(api(), "scrollTo");
		fireEvent.click(screen.getByLabelText("Go to slide 3"));
		expect(scrollTo).toHaveBeenCalledWith(2, false);
	});
});
