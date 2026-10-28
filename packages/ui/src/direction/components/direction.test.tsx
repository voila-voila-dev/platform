// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
	type Direction,
	DirectionProvider,
	useDirection,
} from "#/direction/components/direction.tsx";

afterEach(cleanup);

function ReadDirection() {
	const direction: Direction = useDirection();
	return <span data-testid="direction">{direction}</span>;
}

describe("DirectionProvider", () => {
	it("renders its children unchanged", () => {
		const screen = render(
			<DirectionProvider direction="rtl">
				<button type="button">Book a freelancer</button>
			</DirectionProvider>,
		);
		expect(screen.getByRole("button").textContent).toBe("Book a freelancer");
	});

	it("does not set the dir attribute on the DOM", () => {
		const screen = render(
			<DirectionProvider direction="rtl">
				<p>Right-to-left copy</p>
			</DirectionProvider>,
		);
		expect(screen.container.querySelector("[dir]")).toBeNull();
		expect(document.documentElement.getAttribute("dir")).toBeNull();
	});
});

describe("useDirection", () => {
	it("defaults to ltr without a provider", () => {
		const screen = render(<ReadDirection />);
		expect(screen.getByTestId("direction").textContent).toBe("ltr");
	});

	it("returns the direction of the enclosing provider", () => {
		const screen = render(
			<DirectionProvider direction="rtl">
				<ReadDirection />
			</DirectionProvider>,
		);
		expect(screen.getByTestId("direction").textContent).toBe("rtl");
	});

	it("reads the closest provider when nested", () => {
		const screen = render(
			<DirectionProvider direction="rtl">
				<DirectionProvider direction="ltr">
					<ReadDirection />
				</DirectionProvider>
			</DirectionProvider>,
		);
		expect(screen.getByTestId("direction").textContent).toBe("ltr");
	});
});
