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

const specialties = [
	"Physiotherapist",
	"Osteopath",
	"Nurse",
	"Sports doctor",
	"Podiatrist",
	"Dietitian",
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
		<Combobox items={specialties}>
			<ComboboxInput placeholder="Select a specialty" className="w-64" />
			<ComboboxContent>
				<ComboboxEmpty>No specialty found.</ComboboxEmpty>
				<ComboboxList>
					{(specialty: string) => (
						<ComboboxItem key={specialty} value={specialty}>
							{specialty}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	),
};

export const WithClearButton: Story = {
	render: () => (
		<Combobox items={specialties} defaultValue="Physiotherapist">
			<ComboboxInput
				placeholder="Select a specialty"
				className="w-64"
				showClear
			/>
			<ComboboxContent>
				<ComboboxEmpty>No specialty found.</ComboboxEmpty>
				<ComboboxList>
					{(specialty: string) => (
						<ComboboxItem key={specialty} value={specialty}>
							{specialty}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	),
};

export const Disabled: Story = {
	render: () => (
		<Combobox items={specialties} disabled>
			<ComboboxInput
				placeholder="Select a specialty"
				className="w-64"
				disabled
			/>
			<ComboboxContent>
				<ComboboxEmpty>No specialty found.</ComboboxEmpty>
				<ComboboxList>
					{(specialty: string) => (
						<ComboboxItem key={specialty} value={specialty}>
							{specialty}
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
	const [value, setValue] = useState<string[]>(["Physiotherapist", "Nurse"]);
	return (
		<Combobox
			items={specialties}
			multiple
			value={value}
			onValueChange={setValue}
			disabled={disabled}
		>
			<ComboboxChips ref={anchor} className="w-96">
				<ComboboxValue>
					{(selected: string[]) =>
						selected.map((specialty) => (
							<ComboboxChip key={specialty} showRemove={showRemove}>
								{specialty}
							</ComboboxChip>
						))
					}
				</ComboboxValue>
				<ComboboxChipsInput placeholder="Add a specialty" />
			</ComboboxChips>
			<ComboboxContent anchor={anchor}>
				<ComboboxEmpty>No specialty found.</ComboboxEmpty>
				<ComboboxList>
					{(specialty: string) => (
						<ComboboxItem key={specialty} value={specialty}>
							{specialty}
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
			canvas.getAllByText("Physiotherapist", {
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
		// Add a third specialty by typing into the chips input and picking the match.
		const input = canvas.getByPlaceholderText("Add a specialty");
		await userEvent.type(input, "pod");
		const option = await waitFor(() => {
			const item = document.querySelector("[data-slot=combobox-item]");
			expect(item?.textContent).toContain("Podiatrist");
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
