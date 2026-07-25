// @vitest-environment jsdom
import {
	act,
	cleanup,
	fireEvent,
	render,
	waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "#/components/button.tsx";
import {
	ResponsiveSheet,
	ResponsiveSheetBody,
	ResponsiveSheetContent,
	ResponsiveSheetDescription,
	ResponsiveSheetFooter,
	ResponsiveSheetHeader,
	ResponsiveSheetTitle,
	ResponsiveSheetTrigger,
} from "#/components/responsive-sheet.tsx";

const DESKTOP_WIDTH = 1280;
const MOBILE_WIDTH = 375;

// `useIsMobile` re-reads `window.innerWidth` whenever any media-query
// listener fires, so resizing = set the width + notify every listener.
const mediaQueryListeners = new Set<() => void>();

function setViewportWidth(width: number) {
	Object.defineProperty(window, "innerWidth", {
		configurable: true,
		writable: true,
		value: width,
	});
}

function resizeViewport(width: number) {
	act(() => {
		setViewportWidth(width);
		for (const listener of mediaQueryListeners) {
			listener();
		}
	});
}

beforeEach(() => {
	setViewportWidth(DESKTOP_WIDTH);
	// jsdom has no matchMedia; both vaul and useIsMobile need it.
	vi.stubGlobal(
		"matchMedia",
		vi.fn().mockImplementation((query: string) => ({
			matches: false,
			media: query,
			addEventListener: (_event: string, listener: () => void) => {
				mediaQueryListeners.add(listener);
			},
			removeEventListener: (_event: string, listener: () => void) => {
				mediaQueryListeners.delete(listener);
			},
		})),
	);
});

afterEach(() => {
	cleanup();
	mediaQueryListeners.clear();
	vi.unstubAllGlobals();
});

function Fixture(props: React.ComponentProps<typeof ResponsiveSheetContent>) {
	return (
		<ResponsiveSheet>
			<ResponsiveSheetTrigger render={<Button variant="outline" />}>
				Open email
			</ResponsiveSheetTrigger>
			<ResponsiveSheetContent {...props}>
				<ResponsiveSheetHeader>
					<ResponsiveSheetTitle>Email details</ResponsiveSheetTitle>
					<ResponsiveSheetDescription>
						The message as the recipient received it.
					</ResponsiveSheetDescription>
				</ResponsiveSheetHeader>
				<ResponsiveSheetBody>
					<p>Bonjour Camille</p>
				</ResponsiveSheetBody>
				<ResponsiveSheetFooter>
					<Button>Resend</Button>
				</ResponsiveSheetFooter>
			</ResponsiveSheetContent>
		</ResponsiveSheet>
	);
}

describe("ResponsiveSheet", () => {
	describe("on desktop", () => {
		it("renders only the trigger while closed", () => {
			const screen = render(<Fixture />);
			expect(screen.getByRole("button", { name: "Open email" })).toBeTruthy();
			expect(screen.queryByRole("dialog")).toBeNull();
		});

		it("opens the sheet half, not the drawer", async () => {
			const screen = render(<Fixture />);
			fireEvent.click(screen.getByRole("button", { name: "Open email" }));
			await waitFor(() => {
				expect(
					screen.baseElement.querySelector("[data-slot=sheet-content]"),
				).not.toBeNull();
			});
			expect(
				screen.baseElement.querySelector("[data-slot=drawer-content]"),
			).toBeNull();
			expect(screen.getByText("Email details")).toBeTruthy();
			expect(
				screen.getByText("The message as the recipient received it."),
			).toBeTruthy();
		});

		it("forwards the size to the sheet content", async () => {
			const screen = render(<Fixture size="xl" />);
			fireEvent.click(screen.getByRole("button", { name: "Open email" }));
			await waitFor(() => {
				const content = screen.baseElement.querySelector(
					"[data-slot=sheet-content]",
				);
				expect(content?.getAttribute("data-size")).toBe("xl");
			});
		});
	});

	describe("on mobile", () => {
		beforeEach(() => {
			setViewportWidth(MOBILE_WIDTH);
		});

		it("opens the drawer half, not the sheet", async () => {
			const screen = render(<Fixture />);
			fireEvent.click(screen.getByRole("button", { name: "Open email" }));
			await waitFor(() => {
				expect(
					screen.baseElement.querySelector("[data-slot=drawer-content]"),
				).not.toBeNull();
			});
			expect(
				screen.baseElement.querySelector("[data-slot=sheet-content]"),
			).toBeNull();
			expect(screen.getByText("Email details")).toBeTruthy();
		});

		it("keeps the drawer header left-aligned", async () => {
			const screen = render(<Fixture />);
			fireEvent.click(screen.getByRole("button", { name: "Open email" }));
			await waitFor(() => {
				const header = screen.baseElement.querySelector(
					"[data-slot=drawer-header]",
				);
				expect(
					header?.className.includes(
						"group-data-[vaul-drawer-direction=bottom]/drawer-content:text-left",
					),
				).toBe(true);
			});
		});
	});

	it("keeps the open state when crossing the breakpoint", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Open email" }));
		await waitFor(() => {
			expect(
				screen.baseElement.querySelector("[data-slot=sheet-content]"),
			).not.toBeNull();
		});

		resizeViewport(MOBILE_WIDTH);
		await waitFor(() => {
			expect(
				screen.baseElement.querySelector("[data-slot=drawer-content]"),
			).not.toBeNull();
		});
		expect(screen.getByText("Email details")).toBeTruthy();

		resizeViewport(DESKTOP_WIDTH);
		await waitFor(() => {
			expect(
				screen.baseElement.querySelector("[data-slot=sheet-content]"),
			).not.toBeNull();
		});
		expect(screen.getByText("Email details")).toBeTruthy();
	});

	it("throws when a part is used outside the root", () => {
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});
		expect(() =>
			render(<ResponsiveSheetTrigger>Open</ResponsiveSheetTrigger>),
		).toThrowError(/within <ResponsiveSheet>/);
		consoleError.mockRestore();
	});
});
