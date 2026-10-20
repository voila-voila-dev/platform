import { Context, type Effect, type Option } from "effect";
import type { ImportIntent } from "#bulk-import/aggregates/import-intent";
import type { ImportIntentConflictError } from "#bulk-import/errors/import-intent-conflict-error";
import type { ImportIntentId } from "#bulk-import/value-objects/import-intent-id";
import type { DatabaseError } from "#core/errors/database-error";

// Stores every target's intents; `BulkImport` narrows them to its schema.
export class ImportIntentRepository extends Context.Service<
	ImportIntentRepository,
	{
		readonly insert: (
			intent: ImportIntent,
		) => Effect.Effect<void, DatabaseError>;
		// Fails unless the stored intent is still at `expectedVersion`.
		readonly update: (
			intent: ImportIntent,
			expectedVersion: number,
		) => Effect.Effect<void, DatabaseError | ImportIntentConflictError>;
		readonly get: (
			id: ImportIntentId,
		) => Effect.Effect<Option.Option<ImportIntent>, DatabaseError>;
		readonly delete: (id: ImportIntentId) => Effect.Effect<void, DatabaseError>;
	}
>()("@voila.dev/platform/ImportIntentRepository") {}
