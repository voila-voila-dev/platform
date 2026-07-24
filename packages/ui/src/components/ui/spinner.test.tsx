// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Spinner } from "#/components/ui/spinner.tsx";

afterEach(cleanup);

describe("Spinner", () => {
	it("renders a status element with the default label", () => {
		const screen = render(<Spinner />);
		const spinner = screen.getByRole("status", { name: "Loading" });
		expect(spinner.tagName.toLowerCase()).toBe("svg");
		expect(spinner.getAttribute("data-slot")).toBe("spinner");
	});

	it("lets consumers localize the label", () => {
		const screen = render(<Spinner aria-label="Chargement" />);
		expect(screen.getByRole("status", { name: "Chargement" })).toBeTruthy();
	});

	it("spins continuously but slows under reduced motion", () => {
		const screen = render(<Spinner />);
		const spinner = screen.getByRole("status", { name: "Loading" });
		expect(spinner.classList.contains("animate-spin")).toBe(true);
		expect(
			spinner.classList.contains(
				"motion-reduce:animate-[spin_3s_linear_infinite]",
			),
		).toBe(true);
	});

	it("merges className so size and color can be overridden", () => {
		const screen = render(<Spinner className="size-8 text-brand" />);
		const spinner = screen.getByRole("status", { name: "Loading" });
		expect(spinner.classList.contains("size-8")).toBe(true);
		expect(spinner.classList.contains("size-4")).toBe(false);
		expect(spinner.classList.contains("text-brand")).toBe(true);
	});
});
