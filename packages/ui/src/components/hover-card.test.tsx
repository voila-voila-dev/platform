// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "#/components/button.tsx";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "#/components/hover-card.tsx";

beforeEach(() => {
	// Base UI's Positioner measures the anchor with ResizeObserver, absent in jsdom.
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

function Fixture({
	rootProps,
	...contentProps
}: React.ComponentProps<typeof HoverCardContent> & {
	rootProps?: React.ComponentProps<typeof HoverCard>;
}) {
	return (
		<HoverCard {...rootProps}>
			<HoverCardTrigger delay={0} render={<Button variant="link" />}>
				@nathan.guyot
			</HoverCardTrigger>
			<HoverCardContent {...contentProps}>
				<p>Product designer — Lisbon.</p>
			</HoverCardContent>
		</HoverCard>
	);
}

const queryContent = (screen: ReturnType<typeof render>) =>
	screen.baseElement.querySelector("[data-slot=hover-card-content]");

describe("HoverCard", () => {
	it("renders only the trigger while closed", () => {
		const screen = render(<Fixture />);
		expect(screen.getByRole("button", { name: "@nathan.guyot" })).toBeTruthy();
		expect(queryContent(screen)).toBeNull();
	});

	it("opens on hover and renders the preview content", async () => {
		const screen = render(<Fixture />);
		const trigger = screen.getByRole("button", { name: "@nathan.guyot" });
		fireEvent.pointerEnter(trigger);
		fireEvent.mouseEnter(trigger);
		await waitFor(() => {
			expect(queryContent(screen)).not.toBeNull();
			expect(screen.getByText("Product designer — Lisbon.")).toBeTruthy();
		});
	});

	it("renders open with defaultOpen", async () => {
		const screen = render(<Fixture rootProps={{ defaultOpen: true }} />);
		await waitFor(() => {
			expect(queryContent(screen)).not.toBeNull();
		});
	});

	it("supports a controlled open state", async () => {
		const screen = render(<Fixture rootProps={{ open: true }} />);
		await waitFor(() => {
			expect(queryContent(screen)).not.toBeNull();
		});
		screen.rerender(<Fixture rootProps={{ open: false }} />);
		await waitFor(() => {
			expect(queryContent(screen)).toBeNull();
		});
	});

	it("applies the kit popup surface with the popover-matching width", async () => {
		const screen = render(<Fixture rootProps={{ defaultOpen: true }} />);
		await waitFor(() => {
			const content = queryContent(screen);
			expect(content?.classList.contains("w-72")).toBe(true);
			expect(content?.classList.contains("bg-popover")).toBe(true);
			expect(content?.classList.contains("ring-foreground/10")).toBe(true);
		});
	});

	it("respects reduced motion on the popup animation", async () => {
		const screen = render(<Fixture rootProps={{ defaultOpen: true }} />);
		await waitFor(() => {
			expect(
				queryContent(screen)?.classList.contains("motion-reduce:animate-none"),
			).toBe(true);
		});
	});

	it("forwards the side prop to the positioned popup", async () => {
		const screen = render(
			<Fixture rootProps={{ defaultOpen: true }} side="top" />,
		);
		await waitFor(() => {
			expect(queryContent(screen)?.getAttribute("data-side")).toBe("top");
		});
	});

	it("forwards extra positioner props through the escape hatch", async () => {
		const screen = render(
			<Fixture
				rootProps={{ defaultOpen: true }}
				positionerProps={{ "data-testid": "positioner" } as never}
			/>,
		);
		await waitFor(() => {
			expect(
				screen.baseElement.querySelector('[data-testid="positioner"]'),
			).not.toBeNull();
		});
	});

	it("merges className onto the popup", async () => {
		const screen = render(
			<Fixture rootProps={{ defaultOpen: true }} className="custom-card" />,
		);
		await waitFor(() => {
			expect(queryContent(screen)?.classList.contains("custom-card")).toBe(
				true,
			);
		});
	});
});
