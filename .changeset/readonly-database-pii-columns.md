---
"@voila.dev/platform": minor
---

`maskRows` takes the application's personal data columns, `piiColumns` (a pattern or a predicate on the column name), and the brick no longer ships a list: `isPiiColumn` is removed.

`ColumnDescription`, `JsonRow` and `ReadonlyQueryResult` are value objects (`Schema.Struct`, `Schema.Record`), so an application can use them in its own contracts.
