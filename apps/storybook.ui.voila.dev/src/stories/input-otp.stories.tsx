import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@voila.dev/ui/components/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
	title: "UI/InputOTP",
	component: InputOTP,
	tags: ["autodocs"],
	args: {
		maxLength: 6,
		children: null,
	},
} satisfies Meta<typeof InputOTP>;

export default meta;

type Story = StoryObj<typeof meta>;

function SixDigitSlots() {
	return (
		<InputOTPGroup>
			<InputOTPSlot index={0} />
			<InputOTPSlot index={1} />
			<InputOTPSlot index={2} />
			<InputOTPSlot index={3} />
			<InputOTPSlot index={4} />
			<InputOTPSlot index={5} />
		</InputOTPGroup>
	);
}

export const Default: Story = {
	render: () => (
		<InputOTP maxLength={6}>
			<SixDigitSlots />
		</InputOTP>
	),
};

export const WithSeparator: Story = {
	render: () => (
		<InputOTP maxLength={6}>
			<InputOTPGroup>
				<InputOTPSlot index={0} />
				<InputOTPSlot index={1} />
				<InputOTPSlot index={2} />
			</InputOTPGroup>
			<InputOTPSeparator />
			<InputOTPGroup>
				<InputOTPSlot index={3} />
				<InputOTPSlot index={4} />
				<InputOTPSlot index={5} />
			</InputOTPGroup>
		</InputOTP>
	),
};

export const Disabled: Story = {
	render: () => (
		<InputOTP maxLength={6} disabled>
			<SixDigitSlots />
		</InputOTP>
	),
};

/**
 * Digits-only: non-numeric keystrokes are rejected by the `REGEXP_ONLY_DIGITS`
 * pattern. The play function types a mixed string and asserts only the digits land.
 */
export const DigitsOnly: Story = {
	render: () => (
		<InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
			<SixDigitSlots />
		</InputOTP>
	),
	play: async ({ canvasElement }) => {
		const input = canvasElement.querySelector(
			"[data-slot=input-otp]",
		) as HTMLInputElement;
		input.focus();
		await userEvent.keyboard("12ab34");
		await waitFor(() => expect(input.value).toBe("1234"));
	},
};

/**
 * Error state: pass `aria-invalid` to surface the destructive ring/border that
 * `InputOTPGroup`/`InputOTPSlot` already style with `aria-invalid:` variants.
 */
export const Invalid: Story = {
	render: () => (
		<InputOTP maxLength={6} aria-invalid defaultValue="123">
			<SixDigitSlots />
		</InputOTP>
	),
};

/**
 * Controlled with `onComplete` — the canonical auto-submit-on-last-digit flow.
 * The play function types six digits and asserts the completion callback fired.
 */
export const Controlled: Story = {
	render: function ControlledStory() {
		const [value, setValue] = useState("");
		const [completed, setCompleted] = useState<string | null>(null);

		return (
			<div className="flex flex-col items-center gap-3">
				<InputOTP
					maxLength={6}
					value={value}
					onChange={setValue}
					onComplete={setCompleted}
				>
					<SixDigitSlots />
				</InputOTP>
				<p className="text-muted-foreground text-sm" data-testid="status">
					{completed ? `Completed: ${completed}` : `Typed: ${value || "—"}`}
				</p>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvasElement.querySelector(
			"[data-slot=input-otp]",
		) as HTMLInputElement;
		input.focus();
		await userEvent.keyboard("482913");
		await waitFor(() =>
			expect(canvas.getByTestId("status").textContent).toBe(
				"Completed: 482913",
			),
		);
	},
};
