// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	Alert,
	AlertAction,
	AlertClose,
	AlertDescription,
	AlertTitle,
} from "#/components/ui/alert.tsx";
import { Button } from "#/components/ui/button.tsx";

afterEach(cleanup);

describe("Alert", () => {
	it("renders with the alert role, title and description", () => {
		const screen = render(
			<Alert>
				<AlertTitle>Booking confirmed</AlertTitle>
				<AlertDescription>
					Camille Dubois will cover the match.
				</AlertDescription>
			</Alert>,
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
		const screen = render(<Alert>Neutral</Alert>);
		expect(
			screen.getByRole("alert").classList.contains("text-card-foreground"),
		).toBe(true);
	});

	it.each([
		["destructive", "text-destructive"],
		["success", "text-success"],
		["warning", "text-warning"],
	] as const)("applies the %s variant", (variant, expectedClass) => {
		const screen = render(<Alert variant={variant}>Status</Alert>);
		expect(screen.getByRole("alert").classList.contains(expectedClass)).toBe(
			true,
		);
	});

	it("merges className on the root and sub-components", () => {
		const screen = render(
			<Alert className="custom-alert">
				<AlertTitle className="custom-title">Title</AlertTitle>
				<AlertDescription className="custom-description">
					Description
				</AlertDescription>
			</Alert>,
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
			<Alert>
				<AlertTitle>Stripe</AlertTitle>
				<AlertDescription>
					Finish your <a href="#stripe">onboarding</a>.
				</AlertDescription>
			</Alert>,
		);
		const description = screen
			.getByRole("alert")
			.querySelector("[data-slot=alert-description]");
		expect(description?.className).toContain("[&_a]:underline");
	});

	it("renders the action slot inside the alert", () => {
		const screen = render(
			<Alert>
				<AlertTitle>Application withdrawn</AlertTitle>
				<AlertAction>
					<Button variant="outline" size="xs">
						Undo
					</Button>
				</AlertAction>
			</Alert>,
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
			<Alert>
				<AlertTitle>New feature</AlertTitle>
				<AlertClose onClick={onClick} />
			</Alert>,
		);
		const close = screen.getByRole("button", { name: "Dismiss" });
		expect(close.getAttribute("data-slot")).toBe("alert-close");
		fireEvent.click(close);
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("allows overriding the dismiss button label", () => {
		const screen = render(
			<Alert>
				<AlertTitle>Nouvelle fonctionnalité</AlertTitle>
				<AlertClose aria-label="Fermer" />
			</Alert>,
		);
		expect(screen.getByRole("button", { name: "Fermer" })).toBeTruthy();
	});
});
