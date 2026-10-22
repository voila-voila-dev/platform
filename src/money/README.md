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
- `BasisPoints` is an integer from 0 to 10 000 (1 % = 100) and the base of every rate: `TaxRate` is `BasisPoints.pipe(Schema.brand("TaxRate"))`, and an application brands its own rates the same way. `applyBasisPoints` and `percentFromBasisPoints` take any of them.
- A non-negative amount is core's `NonNegativeInt`.
