// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Gallery, Lightbox } from "#/components/ui/gallery.tsx";

class ObserverStub {
	observe() {}
	unobserve() {}
	disconnect() {}
	takeRecords() {
		return [];
	}
}

beforeEach(() => {
	// Opening the lightbox mounts embla, which needs these observers + matchMedia.
	vi.stubGlobal("ResizeObserver", ObserverStub);
	vi.stubGlobal("IntersectionObserver", ObserverStub);
	vi.stubGlobal(
		"matchMedia",
		vi.fn().mockReturnValue({
			matches: false,
			addEventListener: () => {},
			removeEventListener: () => {},
		}),
	);
});

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
	return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

function allBySlot(screen: ReturnType<typeof render>, slot: string) {
	return screen.baseElement.querySelectorAll(`[data-slot=${slot}]`);
}

const IMAGES = [
	{ src: "https://acme.dev/1.jpg", alt: "Salle 1" },
	{ src: "https://acme.dev/2.jpg", alt: "Salle 2" },
	{ src: "https://acme.dev/3.jpg" },
];

describe("Gallery", () => {
	it("renders a thumbnail per image", () => {
		const screen = render(<Gallery images={IMAGES} />);
		expect(allBySlot(screen, "gallery-thumbnail").length).toBe(3);
	});

	it("uses the alt text as the thumbnail label", () => {
		const screen = render(<Gallery images={IMAGES} />);
		const first = allBySlot(screen, "gallery-thumbnail")[0];
		expect(first?.getAttribute("aria-label")).toBe("Salle 1");
	});

	it("renders an Empty state when there are no images", () => {
		const screen = render(<Gallery images={[]} emptyLabel="Aucune photo" />);
		expect(queryBySlot(screen, "empty")).not.toBeNull();
		expect(queryBySlot(screen, "gallery-grid")).toBeNull();
		expect(screen.baseElement.textContent).toContain("Aucune photo");
	});

	it("opens the lightbox when a thumbnail is clicked", () => {
		const screen = render(<Gallery images={IMAGES} />);
		// Lightbox content is portaled and only mounts once open.
		expect(queryBySlot(screen, "dialog-content")).toBeNull();
		fireEvent.click(allBySlot(screen, "gallery-thumbnail")[0] as Element);
		expect(queryBySlot(screen, "dialog-content")).not.toBeNull();
	});

	it("merges a consumer className into the root", () => {
		const screen = render(
			<Gallery images={IMAGES} className="custom-gallery" />,
		);
		expect(
			queryBySlot(screen, "gallery")?.classList.contains("custom-gallery"),
		).toBe(true);
	});
});

describe("Lightbox", () => {
	it("does not render content while closed", () => {
		const screen = render(
			<Lightbox images={IMAGES} open={false} onOpenChange={() => {}} />,
		);
		expect(queryBySlot(screen, "dialog-content")).toBeNull();
	});

	it("renders the images when open", () => {
		const screen = render(
			<Lightbox images={IMAGES} open onOpenChange={() => {}} />,
		);
		expect(allBySlot(screen, "lightbox-image").length).toBe(3);
	});

	it("calls onOpenChange when dismissed", () => {
		const onOpenChange = vi.fn();
		const screen = render(
			<Lightbox images={IMAGES} open onOpenChange={onOpenChange} />,
		);
		const close = queryBySlot(screen, "dialog-close-button");
		fireEvent.click(close as Element);
		// Base UI passes (open, eventDetails) — assert the first arg only.
		expect(onOpenChange).toHaveBeenCalled();
		expect(onOpenChange.mock.calls[0]?.[0]).toBe(false);
	});
});
