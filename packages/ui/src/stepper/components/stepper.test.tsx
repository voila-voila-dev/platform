// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Stepper } from "#/stepper/components/stepper.tsx";

afterEach(cleanup);

function renderThreeSteps(value: number) {
	return render(
		<Stepper.Root value={value}>
			<Stepper.Item step={1}>
				<Stepper.Indicator />
				<Stepper.Title>Profile</Stepper.Title>
				<Stepper.Separator />
			</Stepper.Item>
			<Stepper.Item step={2}>
				<Stepper.Indicator />
				<Stepper.Title>Availability</Stepper.Title>
				<Stepper.Separator />
			</Stepper.Item>
			<Stepper.Item step={3}>
				<Stepper.Indicator />
				<Stepper.Title>Validation</Stepper.Title>
			</Stepper.Item>
		</Stepper.Root>,
	);
}

describe("Stepper", () => {
	it("renders an ordered list of steps", () => {
		const screen = renderThreeSteps(1);
		const stepper = screen.baseElement.querySelector("[data-slot=stepper]");
		expect(stepper?.tagName).toBe("OL");
		expect(stepper?.querySelectorAll("[data-slot=stepper-item]")).toHaveLength(
			3,
		);
		expect(
			stepper?.querySelectorAll("[data-slot=stepper-item]")[0]?.tagName,
		).toBe("LI");
	});

	it("derives completed, active and inactive states from value", () => {
		const screen = renderThreeSteps(2);
		const items = screen.baseElement.querySelectorAll(
			"[data-slot=stepper-item]",
		);
		expect(items[0]?.getAttribute("data-state")).toBe("completed");
		expect(items[1]?.getAttribute("data-state")).toBe("active");
		expect(items[2]?.getAttribute("data-state")).toBe("inactive");
	});

	it("marks the active step with aria-current", () => {
		const screen = renderThreeSteps(2);
		const items = screen.baseElement.querySelectorAll(
			"[data-slot=stepper-item]",
		);
		expect(items[0]?.getAttribute("aria-current")).toBeNull();
		expect(items[1]?.getAttribute("aria-current")).toBe("step");
		expect(items[2]?.getAttribute("aria-current")).toBeNull();
	});

	it("shows the step number in pending indicators and a check when completed", () => {
		const screen = renderThreeSteps(2);
		const indicators = screen.baseElement.querySelectorAll(
			"[data-slot=stepper-indicator]",
		);
		expect(indicators[0]?.querySelector("svg")).not.toBeNull();
		expect(indicators[0]?.textContent).toBe("");
		expect(indicators[1]?.textContent).toBe("2");
		expect(indicators[2]?.textContent).toBe("3");
	});

	it("renders custom indicator content for non-completed steps", () => {
		const screen = render(
			<Stepper.Root value={1}>
				<Stepper.Item step={1}>
					<Stepper.Indicator>A</Stepper.Indicator>
				</Stepper.Item>
			</Stepper.Root>,
		);
		expect(
			screen.baseElement.querySelector("[data-slot=stepper-indicator]")
				?.textContent,
		).toBe("A");
	});

	it("renders title and description", () => {
		const screen = render(
			<Stepper.Root value={1}>
				<Stepper.Item step={1}>
					<Stepper.Indicator />
					<div>
						<Stepper.Title>Profile</Stepper.Title>
						<Stepper.Description>Your details</Stepper.Description>
					</div>
				</Stepper.Item>
			</Stepper.Root>,
		);
		expect(
			screen.baseElement.querySelector("[data-slot=stepper-title]")
				?.textContent,
		).toBe("Profile");
		expect(
			screen.baseElement.querySelector("[data-slot=stepper-description]")
				?.textContent,
		).toBe("Your details");
	});

	it("defaults to the horizontal orientation and propagates it", () => {
		const screen = renderThreeSteps(1);
		expect(
			screen.baseElement
				.querySelector("[data-slot=stepper]")
				?.getAttribute("data-orientation"),
		).toBe("horizontal");
		expect(
			screen.baseElement
				.querySelector("[data-slot=stepper-item]")
				?.getAttribute("data-orientation"),
		).toBe("horizontal");
		expect(
			screen.baseElement
				.querySelector("[data-slot=stepper-separator]")
				?.getAttribute("data-orientation"),
		).toBe("horizontal");
	});

	it("propagates the vertical orientation", () => {
		const screen = render(
			<Stepper.Root value={1} orientation="vertical">
				<Stepper.Item step={1}>
					<Stepper.Indicator />
					<Stepper.Title>Profile</Stepper.Title>
					<Stepper.Separator />
				</Stepper.Item>
			</Stepper.Root>,
		);
		expect(
			screen.baseElement
				.querySelector("[data-slot=stepper]")
				?.getAttribute("data-orientation"),
		).toBe("vertical");
		expect(
			screen.baseElement
				.querySelector("[data-slot=stepper-separator]")
				?.getAttribute("data-orientation"),
		).toBe("vertical");
	});

	it("hides separators from assistive technology", () => {
		const screen = renderThreeSteps(1);
		expect(
			screen.baseElement
				.querySelector("[data-slot=stepper-separator]")
				?.getAttribute("aria-hidden"),
		).toBe("true");
	});

	it("merges className on every part", () => {
		const screen = render(
			<Stepper.Root value={1} className="custom-stepper">
				<Stepper.Item step={1} className="custom-item">
					<Stepper.Indicator className="custom-indicator" />
					<Stepper.Title className="custom-title">Profile</Stepper.Title>
				</Stepper.Item>
			</Stepper.Root>,
		);
		const root = screen.baseElement;
		expect(
			root
				.querySelector("[data-slot=stepper]")
				?.classList.contains("custom-stepper"),
		).toBe(true);
		expect(
			root
				.querySelector("[data-slot=stepper-item]")
				?.classList.contains("custom-item"),
		).toBe(true);
		expect(
			root
				.querySelector("[data-slot=stepper-indicator]")
				?.classList.contains("custom-indicator"),
		).toBe(true);
		expect(
			root
				.querySelector("[data-slot=stepper-title]")
				?.classList.contains("custom-title"),
		).toBe(true);
	});
});
