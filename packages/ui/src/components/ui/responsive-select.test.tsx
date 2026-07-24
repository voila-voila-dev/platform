// @vitest-environment jsdom
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ResponsiveSelect } from "#/components/ui/responsive-select.tsx";

const DESKTOP_WIDTH = 1280;
const MOBILE_WIDTH = 375;

// `useIsMobile` re-reads `window.innerWidth` whenever a media-query listener
// fires, so resizing = set the width + notify every listener.
const mediaQueryListeners = new Set<() => void>();

function setViewportWidth(width: number) {
	Object.defineProperty(window, "innerWidth", {
		configurable: true,
		writable: true,
		value: width,
	});
}

beforeEach(() => {
	setViewportWidth(DESKTOP_WIDTH);
	vi.stubGlobal(
		"matchMedia",
		vi.fn().mockImplementation((query: string) => ({
			matches: false,
			media: query,
			addEventListener: (_event: string, listener: () => void) => {
				mediaQueryListeners.add(listener);
			},
			removeEventListener: (_event: string, listener: () => void) => {
				mediaQueryListeners.delete(listener);
			},
		})),
	);
});

afterEach(() => {
	cleanup();
	mediaQueryListeners.clear();
	vi.unstubAllGlobals();
});

function Skills({
	value = "designer",
	onValueChange = () => {},
	placeholder,
	...rootProps
}: Partial<React.ComponentProps<typeof ResponsiveSelect.Root>> & {
	placeholder?: string;
}) {
	return (
		<ResponsiveSelect.Root
			value={value}
			onValueChange={onValueChange}
			{...rootProps}
		>
			<ResponsiveSelect.Trigger aria-label="Skill" className="w-full">
				<ResponsiveSelect.Value placeholder={placeholder} />
			</ResponsiveSelect.Trigger>
			<ResponsiveSelect.Content>
				<ResponsiveSelect.Item value="designer">Designer</ResponsiveSelect.Item>
				<ResponsiveSelect.Item value="developer">
					Developer
				</ResponsiveSelect.Item>
			</ResponsiveSelect.Content>
		</ResponsiveSelect.Root>
	);
}

describe("ResponsiveSelect", () => {
	it("projects the parts onto a native select under the mobile breakpoint", () => {
		setViewportWidth(MOBILE_WIDTH);
		const screen = render(<Skills value="designer" />);
		const select = screen.getByRole("combobox", {
			name: "Skill",
		}) as HTMLSelectElement;
		expect(select.tagName).toBe("SELECT");
		expect(select.value).toBe("designer");
		expect(screen.getByRole("option", { name: "Designer" })).toBeDefined();
		expect(screen.getByRole("option", { name: "Developer" })).toBeDefined();
	});

	it("reports the chosen value from the native select", () => {
		setViewportWidth(MOBILE_WIDTH);
		const onValueChange = vi.fn();
		const screen = render(
			<Skills value="designer" onValueChange={onValueChange} />,
		);
		fireEvent.change(screen.getByRole("combobox", { name: "Skill" }), {
			target: { value: "developer" },
		});
		expect(onValueChange).toHaveBeenCalledWith("developer");
	});

	it("renders the Value placeholder as a leading empty option on mobile", () => {
		setViewportWidth(MOBILE_WIDTH);
		const screen = render(<Skills value="" placeholder="Pick a skill" />);
		const empty = screen.getByRole("option", {
			name: "Pick a skill",
		}) as HTMLOptionElement;
		expect(empty.value).toBe("");
	});

	it("maps Group/Label onto a native optgroup on mobile", () => {
		setViewportWidth(MOBILE_WIDTH);
		const screen = render(
			<ResponsiveSelect.Root value="Europe/Paris" onValueChange={() => {}}>
				<ResponsiveSelect.Trigger aria-label="Time zone">
					<ResponsiveSelect.Value />
				</ResponsiveSelect.Trigger>
				<ResponsiveSelect.Content>
					<ResponsiveSelect.Group>
						<ResponsiveSelect.Label>Europe</ResponsiveSelect.Label>
						<ResponsiveSelect.Item value="Europe/Paris">
							Paris
						</ResponsiveSelect.Item>
					</ResponsiveSelect.Group>
					<ResponsiveSelect.Group>
						<ResponsiveSelect.Label>Americas</ResponsiveSelect.Label>
						<ResponsiveSelect.Item value="America/New_York">
							New York
						</ResponsiveSelect.Item>
					</ResponsiveSelect.Group>
				</ResponsiveSelect.Content>
			</ResponsiveSelect.Root>,
		);
		const groups = screen.container.querySelectorAll(
			'[data-slot="native-select-optgroup"]',
		);
		expect(groups.length).toBe(2);
		expect(groups[0]?.getAttribute("label")).toBe("Europe");
		expect(screen.getByRole("option", { name: "New York" })).toBeDefined();
	});

	it("forwards Trigger control attributes to the native select", () => {
		setViewportWidth(MOBILE_WIDTH);
		const screen = render(
			<ResponsiveSelect.Root
				value="designer"
				onValueChange={() => {}}
				name="skill"
				required
			>
				<ResponsiveSelect.Trigger
					id="skill-trigger"
					aria-label="Skill"
					aria-invalid
				>
					<ResponsiveSelect.Value />
				</ResponsiveSelect.Trigger>
				<ResponsiveSelect.Content>
					<ResponsiveSelect.Item value="designer">
						Designer
					</ResponsiveSelect.Item>
				</ResponsiveSelect.Content>
			</ResponsiveSelect.Root>,
		);
		const select = screen.getByRole("combobox", { name: "Skill" });
		expect(select.getAttribute("id")).toBe("skill-trigger");
		expect(select.getAttribute("name")).toBe("skill");
		expect(select.hasAttribute("required")).toBe(true);
		expect(select.getAttribute("aria-invalid")).toBe("true");
	});

	it("renders the Base UI trigger with the selected label on desktop", () => {
		const screen = render(<Skills value="designer" />);
		expect(
			screen.container.querySelector('[data-slot="native-select"]'),
		).toBeNull();
		const trigger = screen.container.querySelector(
			'[data-slot="select-trigger"]',
		);
		expect(trigger).not.toBeNull();
		expect(trigger?.textContent).toContain("Designer");
	});

	it("drops Base UI's null reset when the selected item disappears on desktop", async () => {
		const onValueChange = vi.fn();
		const skills = (items: string[]) => (
			<ResponsiveSelect.Root value="designer" onValueChange={onValueChange}>
				<ResponsiveSelect.Trigger aria-label="Skill" className="w-full">
					<ResponsiveSelect.Value />
				</ResponsiveSelect.Trigger>
				<ResponsiveSelect.Content>
					{items.map((value) => (
						<ResponsiveSelect.Item key={value} value={value}>
							{value}
						</ResponsiveSelect.Item>
					))}
				</ResponsiveSelect.Content>
			</ResponsiveSelect.Root>
		);
		const screen = render(skills(["designer", "developer"]));
		const trigger = screen.container.querySelector(
			'[data-slot="select-trigger"]',
		) as HTMLElement;
		await act(async () => {
			trigger.focus();
			fireEvent.keyDown(trigger, { key: "ArrowDown" });
			await Promise.resolve();
		});
		expect(document.querySelector('[role="listbox"]')).not.toBeNull();
		// Remove the selected item while the popup is open: Base UI resets a
		// single select to `null` when its controlled value no longer matches any
		// item. The wrapper's contract is string-only, so that reset must not
		// reach the consumer (it crashed the skills field with
		// `null.localeCompare` in production).
		await act(async () => {
			screen.rerender(skills(["developer"]));
			await Promise.resolve();
		});
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it("switches surfaces when the viewport crosses the breakpoint", () => {
		const screen = render(<Skills value="designer" />);
		expect(
			screen.container.querySelector('[data-slot="native-select"]'),
		).toBeNull();
		act(() => {
			setViewportWidth(MOBILE_WIDTH);
			for (const listener of mediaQueryListeners) {
				listener();
			}
		});
		expect(
			screen.container.querySelector('[data-slot="native-select"]'),
		).not.toBeNull();
	});
});
