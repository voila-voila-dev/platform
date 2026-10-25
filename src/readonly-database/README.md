# readonly-database

Read-only SQL over a database, for exploration by a person or an assistant. The adapter holds the posture (a read-only session, a statement timeout, a byte cap on the result); `guardQuery` explains a refusal before the statement reaches it.

```ts
import { guardQuery, maskRows, ReadonlyDatabase } from "@voila.dev/platform/readonly-database";

const policy = {
	tables: new Set(["mission", "mission_report"]),
	withheldColumns: { mission_report: ["data"] },
	maxRows: 200,
};

const explore = (rawSql: string) =>
	Effect.gen(function* () {
		const database = yield* ReadonlyDatabase;
		const sql = yield* guardQuery(rawSql, policy);
		const result = yield* database.query(sql);
		return {
			...result,
			...maskRows(result.columns, result.rows, { piiColumns: /(^|_)(email|phone|iban|address)(_|$)/iu }),
		};
	});
```

- `guardQuery(sql, policy)` accepts one `SELECT` (or `WITH … SELECT`) over the policy's tables, reading none of its withheld columns (`*`, a whole row or a renamed column list are refused too), and caps its `LIMIT` at `maxRows` (default `MAX_QUERY_ROWS`, 200). It fails with `QueryRejectedError`.
- `maskRows(columns, rows, { piiColumns, maskedValue? })` masks the columns the application calls personal data (a pattern or a predicate on the column name: the brick ships no list, naming and jurisdiction are the application's) and lists them. The masked value defaults to `MASKED_VALUE`, `"[masked]"`.
- `/readonly-database/pg`'s `pgReadonlyDatabase(poolConfig, { maxResultBytes?, statementTimeoutMillis?, poolMaximum?, schema? })` opens its own `pg` pool with `default_transaction_read_only=on`; give it a role that can only read. Defaults: 64 KiB, 5 s, 2 connections, `public`.
- `/readonly-database/memory` has `stubReadonlyDatabase({ result?, columns? })` and `unavailableReadonlyDatabase(message)`, for an environment without a read-only role.
