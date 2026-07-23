// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Label } from "#/components/ui/label.tsx";

afterEach(cleanup);

function queryLabel(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector("[data-slot=label]");
}

describe("Label", () => {
	it("renders its children in a native label element", () => {
		const screen = render(<Label>Organization email</Label>);
		const label = queryLabel(screen);
		expect(label?.tagName).toBe("LABEL");
		expect(label?.textContent).toBe("Organization email");
	});

	it("forwards htmlFor to the label element", () => {
		const screen = render(
			<Label htmlFor="organization-email">Organization email</Label>,
		);
		expect(queryLabel(screen)?.getAttribute("for")).toBe("organization-email");
	});

	it("associates with its control through htmlFor", () => {
		const screen = render(
			<>
				<Label htmlFor="organization-email">Organization email</Label>
				<input id="organization-email" type="email" />
			</>,
		);
		const input = screen.getByLabelText("Organization email");
		expect(input.tagName).toBe("INPUT");
	});

	it("keeps the base typography and layout classes", () => {
		const screen = render(<Label>Organization email</Label>);
		const label = queryLabel(screen);
		expect(label?.classList.contains("text-sm")).toBe(true);
		expect(label?.classList.contains("font-medium")).toBe(true);
		expect(label?.classList.contains("leading-none")).toBe(true);
		expect(label?.classList.contains("flex")).toBe(true);
		expect(label?.classList.contains("gap-2")).toBe(true);
	});

	it("keeps the peer and group disabled-propagation hooks", () => {
		const screen = render(<Label>Organization email</Label>);
		const label = queryLabel(screen);
		expect(label?.classList.contains("peer-disabled:opacity-50")).toBe(true);
		expect(label?.classList.contains("peer-disabled:cursor-not-allowed")).toBe(
			true,
		);
		expect(
			label?.classList.contains("group-data-[disabled=true]:opacity-50"),
		).toBe(true);
		expect(
			label?.classList.contains(
				"group-data-[disabled=true]:pointer-events-none",
			),
		).toBe(true);
	});

	it("merges className over the base classes", () => {
		const screen = render(
			<Label className="custom-label-class">Organization email</Label>,
		);
		const label = queryLabel(screen);
		expect(label?.classList.contains("custom-label-class")).toBe(true);
		expect(label?.classList.contains("text-sm")).toBe(true);
	});

	it("spreads arbitrary props onto the label element", () => {
		const screen = render(
			<Label id="email-label" data-testid="email-label">
				Organization email
			</Label>,
		);
		const label = queryLabel(screen);
		expect(label?.getAttribute("id")).toBe("email-label");
		expect(label?.getAttribute("data-testid")).toBe("email-label");
	});
});
