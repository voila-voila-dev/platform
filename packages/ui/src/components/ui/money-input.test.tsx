// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MoneyInput } from "#/components/ui/money-input.tsx";

afterEach(cleanup);

function queryAmount(screen: ReturnType<typeof render>): HTMLInputElement {
	const element = screen.baseElement.querySelector<HTMLInputElement>(
		"[data-slot=input-group-control]",
	);
	if (element === null) throw new Error("amount input not found");
	return element;
}

function queryCurrency(screen: ReturnType<typeof render>): HTMLSelectElement {
	const element = screen.baseElement.querySelector<HTMLSelectElement>(
		"[data-slot=money-input-currency]",
	);
	if (element === null) throw new Error("currency select not found");
	return element;
}

describe("MoneyInput", () => {
	it("reports the raw amount on change", () => {
		const onValueChange = vi.fn();
		const screen = render(
			<MoneyInput
				value=""
				onValueChange={onValueChange}
				currency="EUR"
				currencyLabel="Currency"
			/>,
		);
		const amount = queryAmount(screen);
		expect(amount.type).toBe("number");
		fireEvent.change(amount, { target: { value: "120.5" } });
		expect(onValueChange).toHaveBeenCalledWith("120.5");
	});

	it("renders a disabled currency select by default", () => {
		const screen = render(
			<MoneyInput
				value="50"
				onValueChange={() => {}}
				currency="EUR"
				currencyLabel="Currency"
			/>,
		);
		const currency = queryCurrency(screen);
		expect(currency.disabled).toBe(true);
		expect(currency.value).toBe("EUR");
	});

	it("enables the select when several currencies are offered", () => {
		const onCurrencyChange = vi.fn();
		const screen = render(
			<MoneyInput
				value="50"
				onValueChange={() => {}}
				currency="EUR"
				currencies={["EUR", "USD"]}
				onCurrencyChange={onCurrencyChange}
				currencyLabel="Currency"
			/>,
		);
		const currency = queryCurrency(screen);
		expect(currency.disabled).toBe(false);
		fireEvent.change(currency, { target: { value: "USD" } });
		expect(onCurrencyChange).toHaveBeenCalledWith("USD");
	});
});
