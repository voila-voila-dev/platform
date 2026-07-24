import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxValue,
	useComboboxAnchor,
} from "@voila.dev/ui/components/combobox";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

const roles = [
	"Designer",
	"Developer",
	"Data analyst",
	"Copywriter",
	"Consultant",
	"Illustrator",
];

const meta = {
	title: "UI/Combobox",
	component: Combobox,
	tags: ["autodocs"],
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Combobox items={roles}>
			<ComboboxInput placeholder="Select a role" className="w-64" />
			<ComboboxContent>
				<ComboboxEmpty>No role found.</ComboboxEmpty>
				<ComboboxList>
					{(role: string) => (
						<ComboboxItem key={role} value={role}>
							{role}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	),
};

export const WithClearButton: Story = {
	render: () => (
		<Combobox items={roles} defaultValue="Designer">
			<ComboboxInput placeholder="Select a role" className="w-64" showClear />
			<ComboboxContent>
				<ComboboxEmpty>No role found.</ComboboxEmpty>
				<ComboboxList>
					{(role: string) => (
						<ComboboxItem key={role} value={role}>
							{role}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	),
};

export const Disabled: Story = {
	render: () => (
		<Combobox items={roles} disabled>
			<ComboboxInput placeholder="Select a role" className="w-64" disabled />
			<ComboboxContent>
				<ComboboxEmpty>No role found.</ComboboxEmpty>
				<ComboboxList>
					{(role: string) => (
						<ComboboxItem key={role} value={role}>
							{role}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	),
};

function MultiSelectChipsExample({
	showRemove = true,
	disabled = false,
}: {
	showRemove?: boolean;
	disabled?: boolean;
}) {
	const anchor = useComboboxAnchor();
	const [value, setValue] = useState<string[]>(["Designer", "Copywriter"]);
	return (
		<Combobox
			items={roles}
			multiple
			value={value}
			onValueChange={setValue}
			disabled={disabled}
		>
			<ComboboxChips ref={anchor} className="w-96">
				<ComboboxValue>
					{(selected: string[]) =>
						selected.map((role) => (
							<ComboboxChip key={role} showRemove={showRemove}>
								{role}
							</ComboboxChip>
						))
					}
				</ComboboxValue>
				<ComboboxChipsInput placeholder="Add a role" />
			</ComboboxChips>
			<ComboboxContent anchor={anchor}>
				<ComboboxEmpty>No role found.</ComboboxEmpty>
				<ComboboxList>
					{(role: string) => (
						<ComboboxItem key={role} value={role}>
							{role}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}

export const MultiSelectChips: Story = {
	render: () => <MultiSelectChipsExample />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(
			canvas.getAllByText("Designer", {
				selector: "[data-slot=combobox-chip]",
			}),
		).toHaveLength(1);
		expect(
			canvasElement.querySelectorAll("[data-slot=combobox-chip]"),
		).toHaveLength(2);
	},
};

export const MultiSelectChipsAddAndRemove: Story = {
	render: () => <MultiSelectChipsExample />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Add a third role by typing into the chips input and picking the match.
		const input = canvas.getByPlaceholderText("Add a role");
		await userEvent.type(input, "data");
		const option = await waitFor(() => {
			const item = document.querySelector("[data-slot=combobox-item]");
			expect(item?.textContent).toContain("Data analyst");
			return item as HTMLElement;
		});
		await userEvent.click(option);
		await waitFor(() =>
			expect(
				canvasElement.querySelectorAll("[data-slot=combobox-chip]"),
			).toHaveLength(3),
		);
		// Remove the first chip through its remove control.
		const removeButtons = canvasElement.querySelectorAll<HTMLElement>(
			"[data-slot=combobox-chip-remove]",
		);
		await userEvent.click(removeButtons[0]);
		await waitFor(() =>
			expect(
				canvasElement.querySelectorAll("[data-slot=combobox-chip]"),
			).toHaveLength(2),
		);
	},
};

export const MultiSelectChipsWithoutRemove: Story = {
	render: () => <MultiSelectChipsExample showRemove={false} />,
	play: async ({ canvasElement }) => {
		expect(
			canvasElement.querySelectorAll("[data-slot=combobox-chip]"),
		).toHaveLength(2);
		expect(
			canvasElement.querySelector("[data-slot=combobox-chip-remove]"),
		).toBeNull();
	},
};

export const MultiSelectChipsDisabled: Story = {
	render: () => <MultiSelectChipsExample disabled />,
};
