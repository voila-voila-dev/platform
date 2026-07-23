// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyableText } from "#/components/ui/copyable-text.tsx";

function stubClipboard() {
	const writeText = vi.fn().mockResolvedValue(undefined);
	Object.defineProperty(navigator, "clipboard", {
		configurable: true,
		value: { writeText },
	});
	return writeText;
}

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

describe("CopyableText", () => {
	it("renders the value when no label is given", () => {
		const screen = render(<CopyableText value="+33690972105" />);
		expect(screen.getByText("+33690972105")).toBeTruthy();
	});

	it("renders the label but copies the full value", async () => {
		const writeText = stubClipboard();
		const screen = render(
			<CopyableText value="019f7557-04dd-7000-b488" label="019f7557" />,
		);
		expect(screen.getByText("019f7557")).toBeTruthy();
		fireEvent.click(screen.getByRole("button"));
		await waitFor(() => {
			expect(writeText).toHaveBeenCalledWith("019f7557-04dd-7000-b488");
		});
	});

	it("swaps the accessible label to the copied one after a copy", async () => {
		stubClipboard();
		const screen = render(
			<CopyableText
				value="camille@example.com"
				copyLabel="Copier"
				copiedLabel="Copié"
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Copier" }));
		await waitFor(() => {
			expect(screen.getByRole("button", { name: "Copié" })).toBeTruthy();
		});
	});

	it("does not bubble the click to an enclosing row", async () => {
		stubClipboard();
		const onRowClick = vi.fn();
		const screen = render(
			// biome-ignore lint/a11y/noStaticElementInteractions: a plain wrapper stands in for the clickable table row
			<div onClick={onRowClick}>
				<CopyableText value="camille@example.com" />
			</div>,
		);
		fireEvent.click(screen.getByRole("button"));
		await waitFor(() => {
			expect(onRowClick).not.toHaveBeenCalled();
		});
	});
});
