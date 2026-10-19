import { Context, type DateTime, type Effect, type Option } from "effect";
import type { ImportDraft } from "#bulk-import/aggregates/import-draft";
import type { ImportDraftId } from "#bulk-import/value-objects/import-draft-id";
import type { DatabaseError } from "#core/errors/database-error";

export class ImportDraftRepository extends Context.Service<
	ImportDraftRepository,
	{
		readonly save: (
			draft: ImportDraft,
		) => Effect.Effect<ImportDraft, DatabaseError>;
		readonly get: (
			id: ImportDraftId,
		) => Effect.Effect<Option.Option<ImportDraft>, DatabaseError>;
		readonly delete: (id: ImportDraftId) => Effect.Effect<void, DatabaseError>;
		readonly deleteExpired: (
			at: DateTime.Utc,
		) => Effect.Effect<number, DatabaseError>;
	}
>()("@voila.dev/platform/ImportDraftRepository") {}
