import { Effect, Option } from "effect";
import { ImportDraftNotFoundError } from "#bulk-import/errors/import-draft-not-found-error";
import { ImportDraftRepository } from "#bulk-import/services/import-draft-repository";
import type { ImportDraftId } from "#bulk-import/value-objects/import-draft-id";

export function requireImportDraft(id: ImportDraftId) {
	return Effect.gen(function* () {
		const found = yield* (yield* ImportDraftRepository).get(id);
		if (Option.isNone(found))
			return yield* new ImportDraftNotFoundError({ id });
		return found.value;
	});
}
