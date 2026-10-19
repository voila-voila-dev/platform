import { Effect, Schema } from "effect";
import { requireImportDraft } from "#bulk-import/lib/require-import-draft";
import { ImportDraftId } from "#bulk-import/value-objects/import-draft-id";
import { Actor } from "#core/actor/actor";
import { Gate } from "#core/authorization/gates";
import { UseCase } from "#core/use-case/make-use-case";

export const GetImportDraftUseCase = UseCase.make({
	name: "bulk-import.get-import-draft",
	input: Schema.Struct({
		actor: Actor,
		payload: Schema.Struct({ id: ImportDraftId }),
	}),
	gate: Gate.staff(),
	execute: ({ payload }) =>
		Effect.map(requireImportDraft(payload.id), (draft) => ({ draft })),
});
