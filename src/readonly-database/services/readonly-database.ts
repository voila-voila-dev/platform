import { Context, type Effect } from "effect";
import type { ReadonlyQueryError } from "#readonly-database/errors/readonly-query-error";
import type { ColumnDescription } from "#readonly-database/value-objects/column-description";
import type { ReadonlyQueryResult } from "#readonly-database/value-objects/readonly-query-result";

// The posture (a read-only role, a statement timeout, a result cap) belongs to
// the adapter; callers still run every statement through `guardQuery` so a
// refusal is explained rather than surfacing as a permission error.
export class ReadonlyDatabase extends Context.Service<
	ReadonlyDatabase,
	{
		readonly query: (
			sql: string,
		) => Effect.Effect<ReadonlyQueryResult, ReadonlyQueryError>;
		readonly describeTables: (
			tables: ReadonlyArray<string>,
		) => Effect.Effect<ReadonlyArray<ColumnDescription>, ReadonlyQueryError>;
	}
>()("@voila.dev/platform/ReadonlyDatabase") {}
