// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
	Stepper,
	StepperDescription,
	StepperIndicator,
	StepperItem,
	StepperSeparator,
	StepperTitle,
} from "#/components/ui/stepper.tsx";

afterEach(cleanup);

function renderThreeSteps(value: number) {
	return render(
		<Stepper value={value}>
			<StepperItem step={1}>
				<StepperIndicator />
				<StepperTitle>Profile</StepperTitle>
				<StepperSeparator />
			</StepperItem>
			<StepperItem step={2}>
				<StepperIndicator />
				<StepperTitle>Availability</StepperTitle>
				<StepperSeparator />
			</StepperItem>
			<StepperItem step={3}>
				<StepperIndicator />
				<StepperTitle>Validation</StepperTitle>
			</StepperItem>
		</Stepper>,
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
			<Stepper value={1}>
				<StepperItem step={1}>
					<StepperIndicator>A</StepperIndicator>
				</StepperItem>
			</Stepper>,
		);
		expect(
			screen.baseElement.querySelector("[data-slot=stepper-indicator]")
				?.textContent,
		).toBe("A");
	});

	it("renders title and description", () => {
		const screen = render(
			<Stepper value={1}>
				<StepperItem step={1}>
					<StepperIndicator />
					<div>
						<StepperTitle>Profile</StepperTitle>
						<StepperDescription>Your details</StepperDescription>
					</div>
				</StepperItem>
			</Stepper>,
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
			<Stepper value={1} orientation="vertical">
				<StepperItem step={1}>
					<StepperIndicator />
					<StepperTitle>Profile</StepperTitle>
					<StepperSeparator />
				</StepperItem>
			</Stepper>,
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
			<Stepper value={1} className="custom-stepper">
				<StepperItem step={1} className="custom-item">
					<StepperIndicator className="custom-indicator" />
					<StepperTitle className="custom-title">Profile</StepperTitle>
				</StepperItem>
			</Stepper>,
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
