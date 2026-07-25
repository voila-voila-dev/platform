import type * as React from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "#/components/input-group.tsx";
import { cn } from "#/lib/utils.ts";

type MoneyInputProps = Omit<
	React.ComponentProps<typeof InputGroupInput>,
	"type" | "value" | "onChange"
> & {
	/** Raw amount as typed (e.g. `"120"` or `"120.50"`). */
	value: string;
	/** Receives the raw amount string on every change. */
	onValueChange: (value: string) => void;
	/** Selected currency code (e.g. `"EUR"`). */
	currency: string;
	/** Currency codes offered by the select. Defaults to the single `currency`. */
	currencies?: ReadonlyArray<string>;
	/** Receives the selected currency code. Omit when the select is locked. */
	onCurrencyChange?: (currency: string) => void;
	/**
	 * Locks the currency select. Defaults to `true` when there is a single
	 * currency to choose from, so the platform's single-currency case reads as a
	 * disabled selector rather than a bare suffix.
	 */
	currencyDisabled?: boolean;
	/** Accessible name for the currency select. */
	currencyLabel: string;
	/** Wrapper class (width/layout), forwarded to the `InputGroup`. */
	className?: string;
};

/**
 * A money amount input: a numeric field with a trailing currency select. The
 * select is disabled by default (the platform settles in a single currency), so
 * it reads as a locked currency selector rather than a static suffix — pass
 * `currencies` + `onCurrencyChange` to make it interactive. The amount is an
 * uncontrolled-string like the underlying `<input type="number">`; the consumer
 * owns parsing/formatting into cents.
 */
function MoneyInput({
	value,
	onValueChange,
	currency,
	currencies = [currency],
	onCurrencyChange,
	currencyDisabled = currencies.length <= 1,
	currencyLabel,
	className,
	...props
}: MoneyInputProps) {
	return (
		<InputGroup
			className={cn(
				"has-disabled:bg-transparent has-disabled:opacity-100 dark:has-disabled:bg-input/30",
				className,
			)}
			data-slot="money-input"
		>
			<InputGroupInput
				type="number"
				inputMode="decimal"
				min="0"
				step="0.5"
				value={value}
				onChange={(event) => onValueChange(event.target.value)}
				{...props}
			/>
			<InputGroupAddon align="inline-end">
				<select
					data-slot="money-input-currency"
					aria-label={currencyLabel}
					disabled={currencyDisabled}
					value={currency}
					onChange={(event) => onCurrencyChange?.(event.target.value)}
					className={cn(
						"cursor-pointer appearance-none bg-transparent pr-1 text-sm font-medium text-muted-foreground outline-none",
						// A disabled select must stay fully legible (it is the locked
						// currency label), so keep full opacity and drop the cursor.
						"disabled:cursor-default disabled:opacity-100",
					)}
				>
					{currencies.map((code) => (
						<option key={code} value={code}>
							{code}
						</option>
					))}
				</select>
			</InputGroupAddon>
		</InputGroup>
	);
}

export { MoneyInput, type MoneyInputProps };
