import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Combobox, useComboboxAnchor } from "@voila.dev/ui/combobox";
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
	component: Combobox.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof Combobox.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Combobox.Root items={roles}>
			<Combobox.Input placeholder="Select a role" className="w-64" />
			<Combobox.Content>
				<Combobox.Empty>No role found.</Combobox.Empty>
				<Combobox.List>
					{(role: string) => (
						<Combobox.Item key={role} value={role}>
							{role}
						</Combobox.Item>
					)}
				</Combobox.List>
			</Combobox.Content>
		</Combobox.Root>
	),
};

export const WithClearButton: Story = {
	render: () => (
		<Combobox.Root items={roles} defaultValue="Designer">
			<Combobox.Input placeholder="Select a role" className="w-64" showClear />
			<Combobox.Content>
				<Combobox.Empty>No role found.</Combobox.Empty>
				<Combobox.List>
					{(role: string) => (
						<Combobox.Item key={role} value={role}>
							{role}
						</Combobox.Item>
					)}
				</Combobox.List>
			</Combobox.Content>
		</Combobox.Root>
	),
};

export const Disabled: Story = {
	render: () => (
		<Combobox.Root items={roles} disabled>
			<Combobox.Input placeholder="Select a role" className="w-64" disabled />
			<Combobox.Content>
				<Combobox.Empty>No role found.</Combobox.Empty>
				<Combobox.List>
					{(role: string) => (
						<Combobox.Item key={role} value={role}>
							{role}
						</Combobox.Item>
					)}
				</Combobox.List>
			</Combobox.Content>
		</Combobox.Root>
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
		<Combobox.Root
			items={roles}
			multiple
			value={value}
			onValueChange={setValue}
			disabled={disabled}
		>
			<Combobox.Chips ref={anchor} className="w-96">
				<Combobox.Value>
					{(selected: string[]) =>
						selected.map((role) => (
							<Combobox.Chip key={role} showRemove={showRemove}>
								{role}
							</Combobox.Chip>
						))
					}
				</Combobox.Value>
				<Combobox.ChipsInput placeholder="Add a role" />
			</Combobox.Chips>
			<Combobox.Content anchor={anchor}>
				<Combobox.Empty>No role found.</Combobox.Empty>
				<Combobox.List>
					{(role: string) => (
						<Combobox.Item key={role} value={role}>
							{role}
						</Combobox.Item>
					)}
				</Combobox.List>
			</Combobox.Content>
		</Combobox.Root>
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
