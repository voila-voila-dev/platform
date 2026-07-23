// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "#/components/ui/button.tsx";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHandle,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "#/components/ui/drawer.tsx";

function Fixture({
	direction,
	...props
}: React.ComponentProps<typeof DrawerContent> & {
	direction?: React.ComponentProps<typeof Drawer>["direction"];
}) {
	return (
		<Drawer direction={direction}>
			<DrawerTrigger asChild>
				<Button variant="outline">View mission details</Button>
			</DrawerTrigger>
			<DrawerContent {...props}>
				<DrawerHeader>
					<DrawerTitle>Match coverage — Saturday</DrawerTitle>
					<DrawerDescription>
						One physiotherapist requested at Stade Marcel Michelin.
					</DrawerDescription>
				</DrawerHeader>
				<DrawerFooter>
					<Button>Apply to this mission</Button>
					<DrawerClose asChild>
						<Button variant="outline">Dismiss</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

beforeEach(() => {
	// vaul checks the reduced-motion media query; matchMedia is absent in jsdom.
	vi.stubGlobal(
		"matchMedia",
		vi.fn().mockImplementation((query: string) => ({
			matches: false,
			media: query,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		})),
	);
});

afterEach(async () => {
	cleanup();
	// Radix focus-scope dispatches a CustomEvent from a setTimeout scheduled on
	// unmount; flush it before jsdom tears down or it fires in a dead realm.
	await new Promise((resolve) => setTimeout(resolve, 0));
	vi.unstubAllGlobals();
});

describe("Drawer", () => {
	it("renders only the trigger while closed", () => {
		const screen = render(<Fixture />);
		expect(
			screen.getByRole("button", { name: "View mission details" }),
		).toBeTruthy();
		expect(screen.queryByRole("dialog")).toBeNull();
	});

	it("opens on trigger click with title and description", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(
			screen.getByRole("button", { name: "View mission details" }),
		);
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
			expect(screen.getByText("Match coverage — Saturday")).toBeTruthy();
			expect(
				screen.getByText(
					"One physiotherapist requested at Stade Marcel Michelin.",
				),
			).toBeTruthy();
		});
	});

	it("defaults to the bottom direction on the content", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(
			screen.getByRole("button", { name: "View mission details" }),
		);
		await waitFor(() => {
			const content = screen.baseElement.querySelector(
				"[data-slot=drawer-content]",
			);
			expect(content?.getAttribute("data-vaul-drawer-direction")).toBe(
				"bottom",
			);
		});
	});

	it("reflects the direction prop on the content for side drawers", async () => {
		const screen = render(<Fixture direction="right" />);
		fireEvent.click(
			screen.getByRole("button", { name: "View mission details" }),
		);
		await waitFor(() => {
			const content = screen.baseElement.querySelector(
				"[data-slot=drawer-content]",
			);
			expect(content?.getAttribute("data-vaul-drawer-direction")).toBe("right");
		});
	});

	it("renders the grab handle by default", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(
			screen.getByRole("button", { name: "View mission details" }),
		);
		await waitFor(() => {
			expect(
				screen.baseElement.querySelector("[data-slot=drawer-handle]"),
			).not.toBeNull();
		});
	});

	it("hides the grab handle when showHandle is false", async () => {
		const screen = render(<Fixture showHandle={false} />);
		fireEvent.click(
			screen.getByRole("button", { name: "View mission details" }),
		);
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});
		expect(
			screen.baseElement.querySelector("[data-slot=drawer-handle]"),
		).toBeNull();
	});

	it("renders the built-in close button under its own slot, separate from DrawerClose", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(
			screen.getByRole("button", { name: "View mission details" }),
		);
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});
		// The auto X button and the public DrawerClose must not share a slot, so
		// styling `[data-slot=drawer-close]` never hits the X button.
		expect(
			screen.baseElement.querySelector("[data-slot=drawer-close-button]"),
		).not.toBeNull();
		const dismiss = screen.baseElement.querySelector(
			"[data-slot=drawer-close]",
		);
		expect(dismiss?.textContent).toBe("Dismiss");
	});

	it("closes when the built-in close button is clicked", async () => {
		const screen = render(<Fixture direction="right" />);
		fireEvent.click(
			screen.getByRole("button", { name: "View mission details" }),
		);
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});

		fireEvent.click(screen.getByRole("button", { name: "Close" }));
		// The drawer is closed once its content is gone, or still mounted with
		// `data-state="closed"` while an exit transition jsdom never fires plays out.
		await waitFor(() => {
			const content = screen.baseElement.querySelector(
				"[data-slot=drawer-content]",
			);
			expect(
				content === null || content.getAttribute("data-state") === "closed",
			).toBe(true);
		});
	});

	it("closes when a DrawerClose action is clicked", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(
			screen.getByRole("button", { name: "View mission details" }),
		);
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});

		fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
		// The drawer is closed once its content is gone, or still mounted with
		// `data-state="closed"` while an exit transition jsdom never fires plays out.
		await waitFor(() => {
			const content = screen.baseElement.querySelector(
				"[data-slot=drawer-content]",
			);
			expect(
				content === null || content.getAttribute("data-state") === "closed",
			).toBe(true);
		});
	});

	it("overrides the built-in close button label for localization", async () => {
		const screen = render(<Fixture closeButtonLabel="Fermer" />);
		fireEvent.click(
			screen.getByRole("button", { name: "View mission details" }),
		);
		await waitFor(() => {
			expect(screen.getByRole("button", { name: "Fermer" })).toBeTruthy();
		});
	});

	it("hides the built-in close button when showCloseButton is false", async () => {
		const screen = render(<Fixture showCloseButton={false} />);
		fireEvent.click(
			screen.getByRole("button", { name: "View mission details" }),
		);
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});
		expect(
			screen.baseElement.querySelector("[data-slot=drawer-close-button]"),
		).toBeNull();
	});

	it("merges className onto the content", async () => {
		const screen = render(<Fixture className="custom-drawer" />);
		fireEvent.click(
			screen.getByRole("button", { name: "View mission details" }),
		);
		await waitFor(() => {
			const content = screen.baseElement.querySelector(
				"[data-slot=drawer-content]",
			);
			expect(content?.classList.contains("custom-drawer")).toBe(true);
		});
	});

	it("forwards overlayClassName to the overlay", async () => {
		const screen = render(<Fixture overlayClassName="custom-overlay" />);
		fireEvent.click(
			screen.getByRole("button", { name: "View mission details" }),
		);
		await waitFor(() => {
			const overlay = screen.baseElement.querySelector(
				"[data-slot=drawer-overlay]",
			);
			expect(overlay?.classList.contains("custom-overlay")).toBe(true);
		});
	});
});

describe("DrawerHandle", () => {
	it("renders standalone for custom layouts and stays out of the a11y tree", () => {
		const screen = render(<DrawerHandle className="custom-handle" />);
		const handle = screen.baseElement.querySelector(
			"[data-slot=drawer-handle]",
		);
		expect(handle).not.toBeNull();
		expect(handle?.getAttribute("aria-hidden")).toBe("true");
		expect(handle?.classList.contains("custom-handle")).toBe(true);
	});
});
