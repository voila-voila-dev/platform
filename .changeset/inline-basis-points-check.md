---
"@voila.dev/platform": minor
---

`BasisPoints` is the base of every rate: `TaxRate` is `BasisPoints.pipe(Schema.brand("TaxRate"))`, so a `TaxRate` is also `BasisPoints`, and an application brands its own rates the same way. `boundedBasisPoints(label)` is gone. `applyBasisPoints` and `percentFromBasisPoints` take a `BasisPoints` (any rate) instead of a `number`; `basisPointsFromPercent` still returns a plain number for the caller to brand.
