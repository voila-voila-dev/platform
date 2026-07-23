import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	FormattedInput,
	frenchPhoneMask,
	rppsMask,
	siretMask,
} from "@voila.dev/ui/components/formatted-input";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
	title: "UI/FormattedInput",
	component: FormattedInput,
	tags: ["autodocs"],
	args: {
		mask: siretMask,
		placeholder: "123 456 789 00012",
	},
} satisfies Meta<typeof FormattedInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Siret: Story = {};

export const Rpps: Story = {
	args: {
		mask: rppsMask,
		placeholder: "10003456789",
		defaultValue: "10003456789",
	},
};

export const FrenchPhone: Story = {
	args: {
		mask: frenchPhoneMask,
		placeholder: "06 12 34 56 78",
		defaultValue: "0612345678",
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		defaultValue: "12345678900012",
	},
};

export const Invalid: Story = {
	args: {
		defaultValue: "123",
		"aria-invalid": true,
	},
};

function ControlledExample() {
	const [siret, setSiret] = useState("");
	return (
		<div className="flex w-72 flex-col gap-2">
			<FormattedInput
				mask={siretMask}
				value={siret}
				onValueChange={setSiret}
				placeholder="123 456 789 00012"
			/>
			<p className="text-sm text-muted-foreground" data-testid="raw-value">
				Raw: {siret || "—"}
			</p>
		</div>
	);
}

/**
 * Controlled usage: the component displays the formatted SIRET while the
 * consumer state holds the raw digits. The play function types a full SIRET
 * with stray letters mixed in and asserts both sides.
 */
export const Controlled: Story = {
	render: () => <ControlledExample />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input =
			canvas.getByPlaceholderText<HTMLInputElement>("123 456 789 00012");

		await userEvent.type(input, "123abc45678900012");

		await waitFor(() => {
			expect(input.value).toBe("123 456 789 00012");
			expect(canvas.getByTestId("raw-value")).toHaveTextContent(
				"Raw: 12345678900012",
			);
		});
	},
};
