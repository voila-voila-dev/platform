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
	ResponsiveDialog,
	ResponsiveDialogBody,
	ResponsiveDialogClose,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogFooter,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle,
	ResponsiveDialogTrigger,
} from "#/components/responsive-dialog.tsx";

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

function Fixture({
	footerCloseLabel,
	onOpenChange,
	...props
}: React.ComponentProps<typeof ResponsiveDialogContent> & {
	footerCloseLabel?: string;
	onOpenChange?: (open: boolean) => void;
}) {
	return (
		<ResponsiveDialog onOpenChange={onOpenChange}>
			<ResponsiveDialogTrigger render={<Button variant="outline" />}>
				Cancel project
			</ResponsiveDialogTrigger>
			<ResponsiveDialogContent {...props}>
				<ResponsiveDialogHeader>
					<ResponsiveDialogTitle>Cancel this project?</ResponsiveDialogTitle>
					<ResponsiveDialogDescription>
						The assigned freelancer will be notified immediately.
					</ResponsiveDialogDescription>
				</ResponsiveDialogHeader>
				<ResponsiveDialogBody>
					<p>Refunds follow the escrow cancellation policy.</p>
				</ResponsiveDialogBody>
				<ResponsiveDialogFooter closeLabel={footerCloseLabel}>
					<ResponsiveDialogClose render={<Button variant="outline" />}>
						Keep project
					</ResponsiveDialogClose>
					<Button variant="destructive">Confirm cancellation</Button>
				</ResponsiveDialogFooter>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}

describe("ResponsiveDialog", () => {
	describe("on desktop", () => {
		it("renders only the trigger while closed", () => {
			const screen = render(<Fixture />);
			expect(
				screen.getByRole("button", { name: "Cancel project" }),
			).toBeTruthy();
			expect(screen.queryByRole("dialog")).toBeNull();
		});

		it("opens the dialog half, not the drawer", async () => {
			const screen = render(<Fixture />);
			fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
			await waitFor(() => {
				expect(
					screen.baseElement.querySelector("[data-slot=dialog-content]"),
				).not.toBeNull();
			});
			expect(
				screen.baseElement.querySelector("[data-slot=drawer-content]"),
			).toBeNull();
			expect(screen.getByText("Cancel this project?")).toBeTruthy();
			expect(
				screen.getByText(
					"The assigned freelancer will be notified immediately.",
				),
			).toBeTruthy();
		});

		it("forwards the size to the dialog content", async () => {
			const screen = render(<Fixture size="lg" />);
			fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
			await waitFor(() => {
				const content = screen.baseElement.querySelector(
					"[data-slot=dialog-content]",
				);
				expect(content?.getAttribute("data-size")).toBe("lg");
			});
		});

		it("renders the footer closeLabel through the dialog footer", async () => {
			const screen = render(<Fixture footerCloseLabel="Dismiss" />);
			fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
			await waitFor(() => {
				expect(
					screen.baseElement.querySelector("[data-slot=dialog-footer-close]"),
				).not.toBeNull();
			});
		});

		it("closes through ResponsiveDialogClose", async () => {
			const screen = render(<Fixture />);
			fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
			await waitFor(() => {
				expect(screen.getByRole("dialog")).toBeTruthy();
			});
			fireEvent.click(screen.getByRole("button", { name: "Keep project" }));
			await waitFor(() => {
				expect(screen.queryByRole("dialog")).toBeNull();
			});
		});

		it("reports open changes through onOpenChange", async () => {
			const onOpenChange = vi.fn();
			const screen = render(<Fixture onOpenChange={onOpenChange} />);
			fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
			await waitFor(() => {
				expect(onOpenChange).toHaveBeenCalledWith(true);
			});
		});
	});

	describe("on mobile", () => {
		beforeEach(() => {
			setViewportWidth(MOBILE_WIDTH);
		});

		it("opens the drawer half, not the dialog", async () => {
			const screen = render(<Fixture />);
			fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
			await waitFor(() => {
				expect(
					screen.baseElement.querySelector("[data-slot=drawer-content]"),
				).not.toBeNull();
			});
			expect(
				screen.baseElement.querySelector("[data-slot=dialog-content]"),
			).toBeNull();
			expect(screen.getByText("Cancel this project?")).toBeTruthy();
		});

		it("renders the footer closeLabel as a drawer close action", async () => {
			const screen = render(<Fixture footerCloseLabel="Dismiss" />);
			fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
			await waitFor(() => {
				expect(
					screen.baseElement.querySelector("[data-slot=drawer-footer-close]"),
				).not.toBeNull();
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

		it("closes through ResponsiveDialogClose", async () => {
			const screen = render(<Fixture />);
			fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
			await waitFor(() => {
				expect(screen.getByRole("dialog")).toBeTruthy();
			});
			fireEvent.click(screen.getByRole("button", { name: "Keep project" }));
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

		it("adds the drawer gutter to the body", async () => {
			const screen = render(<Fixture />);
			fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
			await waitFor(() => {
				const body = screen.baseElement.querySelector(
					"[data-slot=responsive-dialog-body]",
				);
				expect(body?.classList.contains("px-4")).toBe(true);
			});
		});
	});

	it("keeps the open state when crossing the breakpoint", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
		await waitFor(() => {
			expect(
				screen.baseElement.querySelector("[data-slot=dialog-content]"),
			).not.toBeNull();
		});

		resizeViewport(MOBILE_WIDTH);
		await waitFor(() => {
			expect(
				screen.baseElement.querySelector("[data-slot=drawer-content]"),
			).not.toBeNull();
		});
		expect(
			screen.baseElement.querySelector("[data-slot=dialog-content]"),
		).toBeNull();
		expect(screen.getByText("Cancel this project?")).toBeTruthy();

		resizeViewport(DESKTOP_WIDTH);
		await waitFor(() => {
			expect(
				screen.baseElement.querySelector("[data-slot=dialog-content]"),
			).not.toBeNull();
		});
		expect(screen.getByText("Cancel this project?")).toBeTruthy();
	});

	it("throws when a part is used outside the root", () => {
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});
		expect(() =>
			render(<ResponsiveDialogTrigger>Open</ResponsiveDialogTrigger>),
		).toThrowError(/within <ResponsiveDialog>/);
		consoleError.mockRestore();
	});
});
