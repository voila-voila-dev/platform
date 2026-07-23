import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Input } from "@voila.dev/ui/components/input";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
	title: "UI/Input",
	component: Input,
	tags: ["autodocs"],
	args: {
		type: "text",
		placeholder: "Search providers",
	},
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
	args: {
		disabled: true,
		placeholder: "Mission location",
	},
};

export const Invalid: Story = {
	args: {
		type: "email",
		defaultValue: "not-an-email",
		"aria-invalid": true,
	},
};

export const ReadOnly: Story = {
	args: {
		readOnly: true,
		defaultValue: "RPPS 10003456789",
	},
};

export const Password: Story = {
	args: {
		type: "password",
		defaultValue: "correct-horse-battery",
	},
};

/** Exercises the native date picker indicator, which renders inside the field. */
export const DatePicker: Story = {
	args: {
		type: "date",
		placeholder: undefined,
		defaultValue: "2026-06-11",
	},
};

/** Exercises the `file:` utilities, which no other story renders. */
export const File: Story = {
	args: {
		type: "file",
		placeholder: undefined,
	},
};

/**
 * Focuses the input via the play function so the static canvas (and autodocs)
 * captures the focus ring, which is otherwise never visible at rest.
 */
export const Focused: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText("Search providers");

		await userEvent.click(input);
		await waitFor(() => expect(input).toHaveFocus());
	},
};
