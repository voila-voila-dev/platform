import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { IconPicker } from "@voila.dev/ui/components/icon-picker";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
	title: "UI/IconPicker",
	component: IconPicker,
	tags: ["autodocs"],
	args: {
		value: null,
		onValueChange: () => {},
	},
} satisfies Meta<typeof IconPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const [iconName, setIconName] = useState<string | null>(null);
		return (
			<div className="w-64">
				<IconPicker value={iconName} onValueChange={setIconName} />
			</div>
		);
	},
};

export const Preselected: Story = {
	render: () => {
		const [iconName, setIconName] = useState<string | null>("FirstAidKitIcon");
		return (
			<div className="w-64">
				<IconPicker
					value={iconName}
					onValueChange={setIconName}
					placeholder="Pick a category icon"
				/>
			</div>
		);
	},
};

export const OpenGrid: Story = {
	render: () => {
		const [iconName, setIconName] = useState<string | null>(null);
		return (
			<div className="w-64">
				<IconPicker value={iconName} onValueChange={setIconName} />
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole("combobox"));
		await waitFor(() =>
			expect(
				document.querySelectorAll("[data-slot=icon-picker-swatch]").length,
			).toBeGreaterThan(0),
		);
	},
};

export const SearchWithSpaces: Story = {
	render: () => {
		const [iconName, setIconName] = useState<string | null>(null);
		return (
			<div className="w-64">
				<IconPicker value={iconName} onValueChange={setIconName} />
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole("combobox"));
		const search = await waitFor(() => {
			const input = document.querySelector<HTMLInputElement>(
				"[data-slot=combobox-content] input",
			);
			expect(input).not.toBeNull();
			return input as HTMLInputElement;
		});
		// Regression: the human-formatted spelling must find the camelCase icon.
		await userEvent.type(search, "first aid");
		await waitFor(() =>
			expect(document.querySelector('[aria-label="First Aid"]')).not.toBeNull(),
		);
	},
};

export const LocalizedLabels: Story = {
	render: () => {
		const [iconName, setIconName] = useState<string | null>("HeartbeatIcon");
		return (
			<div className="w-64">
				<IconPicker
					value={iconName}
					onValueChange={setIconName}
					placeholder="Choisir une icône"
					searchPlaceholder="Rechercher des icônes…"
					emptyLabel="Aucune icône trouvée"
					clearLabel="Effacer la sélection"
					moreLabel={(count) => `+${count} de plus — affinez votre recherche`}
				/>
			</div>
		);
	},
};

export const WideTrigger: Story = {
	render: () => {
		const [iconName, setIconName] = useState<string | null>("TagIcon");
		return (
			<div className="w-[40rem]">
				<IconPicker value={iconName} onValueChange={setIconName} />
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole("combobox"));
		// The popup must stay compact (fixed width) even though the trigger is
		// far wider, so the 6-column grid doesn't spread the swatches apart.
		await waitFor(() => {
			const popup = document.querySelector<HTMLElement>(
				"[data-slot=combobox-content]",
			);
			expect(popup).not.toBeNull();
			expect((popup as HTMLElement).getBoundingClientRect().width).toBeLessThan(
				400,
			);
		});
	},
};

export const Disabled: Story = {
	render: () => (
		<div className="w-64">
			<IconPicker value={null} onValueChange={() => {}} disabled />
		</div>
	),
};

export const UncontrolledInForm: Story = {
	render: () => (
		<form className="w-64">
			<IconPicker defaultValue="StethoscopeIcon" name="categoryIcon" />
		</form>
	),
};
