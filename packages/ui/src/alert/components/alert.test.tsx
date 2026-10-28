// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Alert } from "#/alert/components/alert.tsx";
import { Button } from "#/button/components/button.tsx";

afterEach(cleanup);

describe("Alert", () => {
	it("renders with the alert role, title and description", () => {
		const screen = render(
			<Alert.Root>
				<Alert.Title>Booking confirmed</Alert.Title>
				<Alert.Description>
					Camille Dubois will cover the match.
				</Alert.Description>
			</Alert.Root>,
		);
		const alert = screen.getByRole("alert");
		expect(alert).toBeTruthy();
		expect(alert.querySelector("[data-slot=alert-title]")?.textContent).toBe(
			"Booking confirmed",
		);
		expect(
			alert.querySelector("[data-slot=alert-description]")?.textContent,
		).toBe("Camille Dubois will cover the match.");
	});

	it("defaults to the default variant", () => {
		const screen = render(<Alert.Root>Neutral</Alert.Root>);
		expect(
			screen.getByRole("alert").classList.contains("text-card-foreground"),
		).toBe(true);
	});

	it.each([
		["destructive", "text-destructive"],
		["success", "text-success"],
		["warning", "text-warning"],
	] as const)("applies the %s variant", (variant, expectedClass) => {
		const screen = render(<Alert.Root variant={variant}>Status</Alert.Root>);
		expect(screen.getByRole("alert").classList.contains(expectedClass)).toBe(
			true,
		);
	});

	it("merges className on the root and sub-components", () => {
		const screen = render(
			<Alert.Root className="custom-alert">
				<Alert.Title className="custom-title">Title</Alert.Title>
				<Alert.Description className="custom-description">
					Description
				</Alert.Description>
			</Alert.Root>,
		);
		const alert = screen.getByRole("alert");
		expect(alert.classList.contains("custom-alert")).toBe(true);
		expect(
			alert
				.querySelector("[data-slot=alert-title]")
				?.classList.contains("custom-title"),
		).toBe(true);
		expect(
			alert
				.querySelector("[data-slot=alert-description]")
				?.classList.contains("custom-description"),
		).toBe(true);
	});

	it("styles inline links in title and description", () => {
		const screen = render(
			<Alert.Root>
				<Alert.Title>Stripe</Alert.Title>
				<Alert.Description>
					Finish your <a href="#stripe">onboarding</a>.
				</Alert.Description>
			</Alert.Root>,
		);
		const description = screen
			.getByRole("alert")
			.querySelector("[data-slot=alert-description]");
		expect(description?.className).toContain("[&_a]:underline");
	});

	it("renders the action slot inside the alert", () => {
		const screen = render(
			<Alert.Root>
				<Alert.Title>Application withdrawn</Alert.Title>
				<Alert.Action>
					<Button variant="outline" size="xs">
						Undo
					</Button>
				</Alert.Action>
			</Alert.Root>,
		);
		const action = screen
			.getByRole("alert")
			.querySelector("[data-slot=alert-action]");
		expect(action).not.toBeNull();
		expect(screen.getByRole("button", { name: "Undo" })).toBeTruthy();
	});

	it("renders a dismiss button and forwards clicks", () => {
		const onClick = vi.fn();
		const screen = render(
			<Alert.Root>
				<Alert.Title>New feature</Alert.Title>
				<Alert.Close onClick={onClick} />
			</Alert.Root>,
		);
		const close = screen.getByRole("button", { name: "Dismiss" });
		expect(close.getAttribute("data-slot")).toBe("alert-close");
		fireEvent.click(close);
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("allows overriding the dismiss button label", () => {
		const screen = render(
			<Alert.Root>
				<Alert.Title>New feature</Alert.Title>
				<Alert.Close aria-label="Fermer" />
			</Alert.Root>,
		);
		expect(screen.getByRole("button", { name: "Fermer" })).toBeTruthy();
	});

	it("lets Alert.Title become a semantic heading via the render prop", () => {
		const screen = render(
			<Alert.Root>
				<Alert.Title render={<h2>Booking confirmed</h2>} />
			</Alert.Root>,
		);
		const title = screen
			.getByRole("alert")
			.querySelector("[data-slot=alert-title]");
		expect(title?.tagName).toBe("H2");
		expect(title?.textContent).toBe("Booking confirmed");
	});

	it("lets the alert root render as a different element via render", () => {
		const screen = render(<Alert.Root render={<section />}>Status</Alert.Root>);
		const alert = screen.getByRole("alert");
		expect(alert.tagName).toBe("SECTION");
		expect(alert.getAttribute("data-slot")).toBe("alert");
	});

	it("lets Alert.Close render as a link while keeping its styling", () => {
		const screen = render(
			<Alert.Root>
				<Alert.Close render={<a href="#dismiss">Dismiss</a>} />
			</Alert.Root>,
		);
		const close = screen.getByRole("link", { name: "Dismiss" });
		expect(close.getAttribute("data-slot")).toBe("alert-close");
		expect(close.closest("[data-slot=alert-action]")).not.toBeNull();
	});
});
