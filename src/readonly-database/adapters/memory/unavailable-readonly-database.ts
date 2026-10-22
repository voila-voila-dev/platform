import { Effect, Layer } from "effect";
import { ReadonlyQueryError } from "#readonly-database/errors/readonly-query-error";
import { ReadonlyDatabase } from "#readonly-database/services/readonly-database";

// For an environment with no read-only role yet: every call is a clear refusal.
export function unavailableReadonlyDatabase(message: string) {
	const unavailable = new ReadonlyQueryError({ message });
	return Layer.succeed(ReadonlyDatabase, {
		query: () => Effect.fail(unavailable),
		describeTables: () => Effect.fail(unavailable),
	});
}
