import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { MoneyInput } from "@voila.dev/ui/money-input";
import { useState } from "react";

const meta = {
	title: "UI/MoneyInput",
	component: MoneyInput,
	tags: ["autodocs"],
	// MoneyInput's props are required; every story overrides via `render`, but the
	// meta-level args satisfy the component type.
	args: {
		value: "120",
		onValueChange: () => {},
		currency: "EUR",
		currencyLabel: "Currency",
	},
} satisfies Meta<typeof MoneyInput>;

export default meta;

type Story = StoryObj<typeof meta>;

function ControlledMoneyInput() {
	const [value, setValue] = useState("120");

	// The platform settles in a single currency, so the trailing select is locked
	// (disabled). The amount field must stay fully legible — not greyed out by the
	// disabled currency.
	return (
		<div className="w-full max-w-xs">
			<MoneyInput
				value={value}
				onValueChange={setValue}
				currency="EUR"
				currencyLabel="Currency"
			/>
		</div>
	);
}

/** Locked single currency: the amount stays legible, only the currency reads as fixed. */
export const Default: Story = {
	render: () => <ControlledMoneyInput />,
};

function MultiCurrencyMoneyInput() {
	const [value, setValue] = useState("120");
	const [currency, setCurrency] = useState("EUR");

	return (
		<div className="w-full max-w-xs">
			<MoneyInput
				value={value}
				onValueChange={setValue}
				currency={currency}
				currencies={["EUR", "USD", "GBP"]}
				onCurrencyChange={setCurrency}
				currencyLabel="Currency"
			/>
		</div>
	);
}

/** An interactive currency select when several currencies are offered. */
export const MultiCurrency: Story = {
	render: () => <MultiCurrencyMoneyInput />,
};

/** A genuinely disabled amount field still greys out (its own disabled styling). */
export const Disabled: Story = {
	render: () => (
		<div className="w-full max-w-xs">
			<MoneyInput
				value="120"
				onValueChange={() => {}}
				currency="EUR"
				currencyLabel="Currency"
				disabled
			/>
		</div>
	),
};
