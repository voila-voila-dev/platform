# money

Amounts as integers in the currency's minor unit, so arithmetic stays exact.

```ts
import { Money, formatMoney, parseMoneyInput, moneyInput, applyBasisPoints, TaxRate } from "@voila.dev/platform/money";

const price = Money.make({ amount: 2550, currency: "EUR" });
formatMoney(price, "fr-FR"); // "25,50 €"

parseMoneyInput("1 234,50", "EUR"); // Option.some(123450)
moneyInput(123450, "EUR"); // "1234.50"

const vat = TaxRate.make(2000); // 20 %
applyBasisPoints(price.amount, vat); // 510
```

- `Currency` is every active ISO 4217 national currency; `currencyDecimals` its minor-unit exponent (JPY 0, EUR 2, KWD 3). Which currencies an application transacts in is its own configuration.
- `parseMoneyInput` refuses negative amounts and more decimals than the currency has.
- `BasisPoints` and `TaxRate` are integers from 0 to 10 000 (1 % = 100). `boundedBasisPoints(label)` builds another rate brand on the same check.
- A non-negative amount is core's `NonNegativeInt`.
