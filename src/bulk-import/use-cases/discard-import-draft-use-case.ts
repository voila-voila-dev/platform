import { Effect, Schema } from "effect";
import { requireImportDraft } from "#bulk-import/lib/require-import-draft";
import { ImportDraftRepository } from "#bulk-import/services/import-draft-repository";
import { ImportDraftId } from "#bulk-import/value-objects/import-draft-id";
import { Actor } from "#core/actor/actor";
import { Gate } from "#core/authorization/gates";
import { UseCase } from "#core/use-case/make-use-case";

export const DiscardImportDraftUseCase = UseCase.make({
	name: "bulk-import.discard-import-draft",
	input: Schema.Struct({
		actor: Actor,
		payload: Schema.Struct({ id: ImportDraftId }),
	}),
	gate: Gate.staff(),
	execute: ({ payload }) =>
		Effect.gen(function* () {
			const draft = yield* requireImportDraft(payload.id);
			yield* (yield* ImportDraftRepository).delete(draft.id);
		}),
});
