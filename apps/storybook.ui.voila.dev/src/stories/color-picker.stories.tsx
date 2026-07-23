import type { Meta, StoryObj } from "@storybook/tanstack-react";
import type { BadgeColor } from "@voila.dev/ui/components/badge";
import { ColorPicker } from "@voila.dev/ui/components/color-picker";
import { Field, FieldLabel } from "@voila.dev/ui/components/field";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
	title: "UI/ColorPicker",
	component: ColorPicker,
	tags: ["autodocs"],
	args: {
		value: null,
		onValueChange: () => {},
	},
} satisfies Meta<typeof ColorPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const [color, setColor] = useState<BadgeColor | null>(null);
		return (
			<div className="w-56">
				<ColorPicker value={color} onValueChange={setColor} />
			</div>
		);
	},
};

export const Preselected: Story = {
	render: () => {
		const [color, setColor] = useState<BadgeColor | null>("emerald");
		return (
			<div className="flex w-56 flex-col gap-3">
				<ColorPicker value={color} onValueChange={setColor} />
				<p className="text-sm text-muted-foreground">
					Selected color: {color ?? "none"}
				</p>
			</div>
		);
	},
};

export const OpenGrid: Story = {
	render: () => {
		const [color, setColor] = useState<BadgeColor | null>("blue");
		return (
			<div className="w-56">
				<ColorPicker value={color} onValueChange={setColor} />
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole("button"));
		await waitFor(() =>
			expect(
				document.querySelectorAll("[data-slot=color-picker-swatch]"),
			).toHaveLength(20),
		);
	},
};

export const Clearable: Story = {
	render: () => {
		const [color, setColor] = useState<BadgeColor | null>("rose");
		return (
			<div className="w-56">
				<ColorPicker value={color} onValueChange={setColor} clearable />
			</div>
		);
	},
};

export const LocalizedLabels: Story = {
	render: () => {
		const [color, setColor] = useState<BadgeColor | null>("violet");
		return (
			<div className="w-56">
				<ColorPicker
					value={color}
					onValueChange={setColor}
					placeholder="Choisir une couleur"
					clearLabel="Effacer la sélection"
					clearable
				/>
			</div>
		);
	},
};

export const Disabled: Story = {
	render: () => (
		<div className="w-56">
			<ColorPicker value={null} onValueChange={() => {}} disabled />
		</div>
	),
};

export const WithFieldLabel: Story = {
	render: () => {
		const [color, setColor] = useState<BadgeColor | null>("amber");
		return (
			<Field className="w-56">
				<FieldLabel>Badge color</FieldLabel>
				<ColorPicker value={color} onValueChange={setColor} />
			</Field>
		);
	},
};

export const UncontrolledInForm: Story = {
	render: () => (
		<form className="w-56">
			<ColorPicker defaultValue="teal" name="badgeColor" />
		</form>
	),
};
