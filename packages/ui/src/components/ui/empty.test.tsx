// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "#/components/ui/empty.tsx";

afterEach(cleanup);

const querySlot = (screen: ReturnType<typeof render>, slot: string) =>
	screen.baseElement.querySelector(`[data-slot=${slot}]`);

describe("Empty", () => {
	it("renders the root with its slot and layout classes", () => {
		const screen = render(<Empty>Nothing here</Empty>);
		const root = querySlot(screen, "empty");
		expect(root).toBeTruthy();
		expect(root?.textContent).toBe("Nothing here");
	});

	it("renders no frame by default", () => {
		// Regression: the root used to declare `border-dashed` without a border
		// width — dead code that consumers compensated for with wrapper divs.
		const screen = render(<Empty />);
		const root = querySlot(screen, "empty");
		expect(root?.classList.contains("border-dashed")).toBe(false);
		expect(root?.classList.contains("border")).toBe(false);
		expect(root?.hasAttribute("data-bordered")).toBe(false);
	});

	it("draws the dashed frame itself when bordered", () => {
		const screen = render(<Empty bordered />);
		const root = querySlot(screen, "empty");
		expect(root?.hasAttribute("data-bordered")).toBe(true);
		expect(root?.classList.contains("border")).toBe(true);
		expect(root?.classList.contains("border-dashed")).toBe(true);
	});

	it("merges className onto the root", () => {
		const screen = render(<Empty className="custom-empty" />);
		expect(querySlot(screen, "empty")?.classList.contains("custom-empty")).toBe(
			true,
		);
	});
});

describe("EmptyMedia", () => {
	it("uses the empty-media slot, not the legacy empty-icon", () => {
		// Regression: the slot was named `empty-icon` while the component is
		// Media and supports a non-icon default variant.
		const screen = render(<EmptyMedia />);
		expect(querySlot(screen, "empty-media")).toBeTruthy();
		expect(querySlot(screen, "empty-icon")).toBeNull();
	});

	it("defaults to the default variant and default size", () => {
		const screen = render(<EmptyMedia />);
		const media = querySlot(screen, "empty-media");
		expect(media?.getAttribute("data-variant")).toBe("default");
		expect(media?.getAttribute("data-size")).toBe("default");
		expect(media?.classList.contains("bg-transparent")).toBe(true);
		expect(media?.classList.contains("size-8")).toBe(false);
	});

	it("sizes the icon chip per size variant", () => {
		const cases = [
			{ size: "sm", chip: "size-6" },
			{ size: "default", chip: "size-8" },
			{ size: "lg", chip: "size-10" },
		] as const;
		for (const { size, chip } of cases) {
			const screen = render(<EmptyMedia size={size} variant="icon" />);
			const media = querySlot(screen, "empty-media");
			expect(media?.getAttribute("data-size")).toBe(size);
			expect(media?.classList.contains(chip)).toBe(true);
			expect(media?.classList.contains("bg-muted")).toBe(true);
			cleanup();
		}
	});

	it("lets className win over variant classes via tailwind-merge", () => {
		// Regression: className used to be passed into cva and then through cn
		// again — a redundant double merge diverging from the field.tsx idiom.
		const screen = render(<EmptyMedia className="bg-accent" variant="icon" />);
		const media = querySlot(screen, "empty-media");
		expect(media?.classList.contains("bg-accent")).toBe(true);
		expect(media?.classList.contains("bg-muted")).toBe(false);
	});
});

describe("EmptyTitle", () => {
	it("renders a heading element for page semantics", () => {
		const screen = render(<EmptyTitle>No projects yet</EmptyTitle>);
		const title = querySlot(screen, "empty-title");
		expect(title?.tagName).toBe("H3");
		expect(title?.textContent).toBe("No projects yet");
	});
});

describe("EmptyDescription", () => {
	it("renders a real <p> matching its props type", () => {
		// Regression: typed as ComponentProps<"p"> but rendered a <div>.
		const screen = render(<EmptyDescription>Try again.</EmptyDescription>);
		const description = querySlot(screen, "empty-description");
		expect(description?.tagName).toBe("P");
		expect(description?.textContent).toBe("Try again.");
	});
});

describe("EmptyHeader and EmptyContent", () => {
	it("render their slots and merge className", () => {
		const screen = render(
			<Empty>
				<EmptyHeader className="custom-header">head</EmptyHeader>
				<EmptyContent className="custom-content">body</EmptyContent>
			</Empty>,
		);
		expect(
			querySlot(screen, "empty-header")?.classList.contains("custom-header"),
		).toBe(true);
		expect(
			querySlot(screen, "empty-content")?.classList.contains("custom-content"),
		).toBe(true);
	});
});
