import { Effect, Schema } from "effect";
import { requireImportDraft } from "#bulk-import/lib/require-import-draft";
import { requireImportSchema } from "#bulk-import/lib/require-import-schema";
import { ImportDraftRepository } from "#bulk-import/services/import-draft-repository";
import { ImportLimits } from "#bulk-import/services/import-limits";
import { ImportDraftId } from "#bulk-import/value-objects/import-draft-id";
import { Actor } from "#core/actor/actor";
import { Gate } from "#core/authorization/gates";
import { UseCase } from "#core/use-case/make-use-case";

export const UpdateImportDraftCellUseCase = UseCase.make({
	name: "bulk-import.update-import-draft-cell",
	input: Schema.Struct({
		actor: Actor,
		payload: Schema.Struct({
			id: ImportDraftId,
			rowIndex: Schema.Int,
			column: Schema.String,
			value: Schema.String,
		}),
	}),
	gate: Gate.staff(),
	execute: ({ payload }) =>
		Effect.gen(function* () {
			const draft = yield* requireImportDraft(payload.id);
			const edited = yield* draft.editCell({
				schema: yield* requireImportSchema(draft.target),
				rowIndex: payload.rowIndex,
				column: payload.column,
				value: payload.value,
				lifetimeDays: (yield* ImportLimits).draftLifetimeDays,
			});
			return { draft: yield* (yield* ImportDraftRepository).save(edited) };
		}),
});
