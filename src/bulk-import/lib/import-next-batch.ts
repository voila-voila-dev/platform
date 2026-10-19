import { Effect } from "effect";
import type { ImportDraft } from "#bulk-import/aggregates/import-draft";
import { ImportDraftAlreadyImportedError } from "#bulk-import/errors/import-draft-already-imported-error";
import { requireImportDraft } from "#bulk-import/lib/require-import-draft";
import type { ImportRow } from "#bulk-import/payloads/import-row";
import { ImportDraftRepository } from "#bulk-import/services/import-draft-repository";
import { ImportLimits } from "#bulk-import/services/import-limits";
import type { ImportDraftId } from "#bulk-import/value-objects/import-draft-id";
import type { ImportOutcome } from "#bulk-import/value-objects/import-outcome";

// The application's own use case gates the import and writes the rows; this
// hands it the next batch of valid rows and records how they landed.
export function importNextBatch<E, R>(
	id: ImportDraftId,
	importRows: (
		rows: ReadonlyArray<ImportRow>,
		draft: ImportDraft,
	) => Effect.Effect<ImportOutcome, E, R>,
) {
	return Effect.gen(function* () {
		const draft = yield* requireImportDraft(id);
		if (draft.isImported)
			return yield* new ImportDraftAlreadyImportedError({ id: draft.id });

		const limits = yield* ImportLimits;
		const batch = draft.nextBatch(limits.batchSize);
		const advanced = yield* draft.recordBatch({
			rowCount: batch.length,
			outcome: yield* importRows(batch, draft),
			lifetimeDays: limits.draftLifetimeDays,
		});
		return { draft: yield* (yield* ImportDraftRepository).save(advanced) };
	});
}
