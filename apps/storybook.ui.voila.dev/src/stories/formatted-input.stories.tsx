import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	businessIdMask,
	FormattedInput,
	idNumberMask,
	phoneMask,
} from "@voila.dev/ui/formatted-input";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
	title: "UI/FormattedInput",
	component: FormattedInput,
	tags: ["autodocs"],
	args: {
		mask: businessIdMask,
		placeholder: "123 456 789 00012",
	},
} satisfies Meta<typeof FormattedInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BusinessId: Story = {};

export const IdNumber: Story = {
	args: {
		mask: idNumberMask,
		placeholder: "10003456789",
		defaultValue: "10003456789",
	},
};

export const Phone: Story = {
	args: {
		mask: phoneMask,
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
	const [businessId, setBusinessId] = useState("");
	return (
		<div className="flex w-72 flex-col gap-2">
			<FormattedInput
				mask={businessIdMask}
				value={businessId}
				onValueChange={setBusinessId}
				placeholder="123 456 789 00012"
			/>
			<p className="text-sm text-muted-foreground" data-testid="raw-value">
				Raw: {businessId || "—"}
			</p>
		</div>
	);
}

/**
 * Controlled usage: the component displays the formatted business id while the
 * consumer state holds the raw digits. The play function types a full business id
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
