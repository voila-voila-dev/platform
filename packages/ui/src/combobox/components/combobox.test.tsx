// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Combobox } from "#/combobox/components/combobox.tsx";
import { useComboboxAnchor } from "#/combobox/hooks/use-combobox-anchor.ts";

const specialties = [
	"Designer",
	"Developer",
	"Copywriter",
	"Data analyst",
	"Illustrator",
	"Consultant",
];

function renderCombobox(
	rootProps: Partial<React.ComponentProps<typeof Combobox.Root>> = {},
	inputProps: React.ComponentProps<typeof Combobox.Input> = {},
) {
	return render(
		<Combobox.Root items={specialties} {...rootProps}>
			<Combobox.Input placeholder="Select a specialty" {...inputProps} />
			<Combobox.Content>
				<Combobox.Empty>No specialty found.</Combobox.Empty>
				<Combobox.List>
					{(specialty: string) => (
						<Combobox.Item key={specialty} value={specialty}>
							{specialty}
						</Combobox.Item>
					)}
				</Combobox.List>
			</Combobox.Content>
		</Combobox.Root>,
	);
}

function itemLabels() {
	return Array.from(document.querySelectorAll("[data-slot=combobox-item]")).map(
		(item) => item.textContent,
	);
}

afterEach(cleanup);

describe("Combobox", () => {
	it("renders the input with its placeholder", () => {
		const screen = renderCombobox();
		expect(screen.getByPlaceholderText("Select a specialty")).toBeTruthy();
	});

	it("keeps the popup out of the DOM while closed", () => {
		renderCombobox();
		expect(document.querySelector("[data-slot=combobox-content]")).toBeNull();
	});

	it("renders every item when open with no query", () => {
		renderCombobox({ defaultOpen: true });
		expect(itemLabels()).toEqual(specialties);
	});

	it("filters the list down to the matching item as the user types", async () => {
		const screen = renderCombobox({ defaultOpen: true });
		fireEvent.change(screen.getByPlaceholderText("Select a specialty"), {
			target: { value: "dev" },
		});
		await waitFor(() => {
			expect(itemLabels()).toEqual(["Developer"]);
		});
	});

	it("clears the list and exposes the empty slot when nothing matches", async () => {
		const screen = renderCombobox({ defaultOpen: true });
		fireEvent.change(screen.getByPlaceholderText("Select a specialty"), {
			target: { value: "zzz" },
		});
		await waitFor(() => {
			expect(itemLabels()).toEqual([]);
		});
		expect(document.querySelector("[data-slot=combobox-empty]")).not.toBeNull();
	});

	it("marks the selected item and shows its check indicator", () => {
		renderCombobox({ defaultValue: "Copywriter", defaultOpen: true });
		const selected = document.querySelector(
			"[data-slot=combobox-item][data-selected]",
		);
		expect(selected?.textContent).toContain("Copywriter");
		expect(selected?.querySelector("svg")).not.toBeNull();
	});

	it("gives the caret trigger an accessible name by default", () => {
		const screen = renderCombobox();
		expect(screen.getByRole("button", { name: "Open list" })).toBeTruthy();
	});

	it("forwards a consumer-supplied aria-label onto the trigger", () => {
		render(
			<Combobox.Root items={specialties}>
				<Combobox.Trigger aria-label="Show specialties" />
			</Combobox.Root>,
		);
		const trigger = document.querySelector("[data-slot=combobox-trigger]");
		expect(trigger?.getAttribute("aria-label")).toBe("Show specialties");
	});

	it("does not render a clear button by default", () => {
		renderCombobox({ defaultValue: "Developer" });
		expect(document.querySelector("[data-slot=combobox-clear]")).toBeNull();
	});

	it("gives the clear button an accessible name when shown", () => {
		const screen = renderCombobox(
			{ defaultValue: "Developer" },
			{
				showClear: true,
			},
		);
		expect(
			screen.getByRole("button", { name: "Clear selection" }),
		).toBeTruthy();
	});

	it("disables the input when asked", () => {
		const screen = renderCombobox({}, { disabled: true });
		const input = screen.getByPlaceholderText("Select a specialty");
		expect(input.hasAttribute("disabled")).toBe(true);
	});

	it("forwards the value and multiple generics through the wrapper", () => {
		// Compile-time guard: a string-array multi-select keeps its element type.
		renderCombobox({
			multiple: true,
			defaultValue: ["Developer", "Copywriter"],
		});
		expect(document.querySelector("[data-slot=input-group]")).not.toBeNull();
	});

	describe("chips (multi-select)", () => {
		function renderChips(
			chipProps: Partial<React.ComponentProps<typeof Combobox.Chip>> = {},
		) {
			return render(
				<Combobox.Root
					items={specialties}
					multiple
					defaultValue={["Developer", "Copywriter"]}
				>
					<Combobox.Chips>
						<Combobox.Value>
							{(value: string[]) =>
								value.map((item) => (
									<Combobox.Chip key={item} {...chipProps}>
										{item}
									</Combobox.Chip>
								))
							}
						</Combobox.Value>
						<Combobox.ChipsInput placeholder="Add specialty" />
					</Combobox.Chips>
				</Combobox.Root>,
			);
		}

		it("renders one chip per selected value", () => {
			renderChips();
			const chips = document.querySelectorAll("[data-slot=combobox-chip]");
			expect(Array.from(chips).map((chip) => chip.textContent)).toEqual([
				"Developer",
				"Copywriter",
			]);
		});

		it("renders a remove control inside each chip by default", () => {
			renderChips();
			expect(
				document.querySelectorAll("[data-slot=combobox-chip-remove]").length,
			).toBe(2);
		});

		it("hides the remove control when showRemove is false", () => {
			renderChips({ showRemove: false });
			expect(
				document.querySelector("[data-slot=combobox-chip-remove]"),
			).toBeNull();
		});

		// Full tag-input wiring: chips row anchors the popup via useComboboxAnchor.
		function ChipsWithPopup({
			defaultOpen = false,
		}: {
			defaultOpen?: boolean;
		}) {
			const anchor = useComboboxAnchor();
			return (
				<Combobox.Root
					items={specialties}
					multiple
					defaultValue={["Developer", "Copywriter"]}
					defaultOpen={defaultOpen}
				>
					<Combobox.Chips ref={anchor}>
						<Combobox.Value>
							{(value: string[]) =>
								value.map((item) => (
									<Combobox.Chip key={item}>{item}</Combobox.Chip>
								))
							}
						</Combobox.Value>
						<Combobox.ChipsInput placeholder="Add specialty" />
					</Combobox.Chips>
					<Combobox.Content anchor={anchor}>
						<Combobox.Empty>No specialty found.</Combobox.Empty>
						<Combobox.List>
							{(specialty: string) => (
								<Combobox.Item key={specialty} value={specialty}>
									{specialty}
								</Combobox.Item>
							)}
						</Combobox.List>
					</Combobox.Content>
				</Combobox.Root>
			);
		}

		function chipLabels() {
			return Array.from(
				document.querySelectorAll("[data-slot=combobox-chip]"),
			).map((chip) => chip.textContent);
		}

		it("removes the chip's value from the selection when its remove control is clicked", async () => {
			render(<ChipsWithPopup />);
			const removeButtons = document.querySelectorAll(
				"[data-slot=combobox-chip-remove]",
			);
			fireEvent.click(removeButtons[0] as HTMLElement);
			await waitFor(() => {
				expect(chipLabels()).toEqual(["Copywriter"]);
			});
		});

		it("filters the popup list as the user types in the chips input", async () => {
			const screen = render(<ChipsWithPopup defaultOpen />);
			fireEvent.change(screen.getByPlaceholderText("Add specialty"), {
				target: { value: "cons" },
			});
			await waitFor(() => {
				expect(itemLabels()).toEqual(["Consultant"]);
			});
		});

		it("adds a chip when an item is selected from the popup", async () => {
			render(<ChipsWithPopup defaultOpen />);
			const podiatrist = Array.from(
				document.querySelectorAll("[data-slot=combobox-item]"),
			).find((item) => item.textContent?.includes("Illustrator"));
			expect(podiatrist).toBeTruthy();
			fireEvent.click(podiatrist as HTMLElement);
			await waitFor(() => {
				expect(chipLabels()).toEqual([
					"Developer",
					"Copywriter",
					"Illustrator",
				]);
			});
		});

		it("flags the popup as chip-anchored so it sizes to the chips row", () => {
			render(<ChipsWithPopup defaultOpen />);
			const content = document.querySelector("[data-slot=combobox-content]");
			expect(content?.getAttribute("data-chips")).toBe("true");
		});
	});
});
