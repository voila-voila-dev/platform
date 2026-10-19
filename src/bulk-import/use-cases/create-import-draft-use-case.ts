import { Effect, Schema } from "effect";
import { ImportDraft } from "#bulk-import/aggregates/import-draft";
import { ImportFileRejectedError } from "#bulk-import/errors/import-file-rejected-error";
import { decodeImportTable } from "#bulk-import/lib/import-schema";
import { requireImportSchema } from "#bulk-import/lib/require-import-schema";
import { ImportDraftRepository } from "#bulk-import/services/import-draft-repository";
import { ImportLimits } from "#bulk-import/services/import-limits";
import { ImportReaders } from "#bulk-import/services/import-readers";
import { ImportDraftId } from "#bulk-import/value-objects/import-draft-id";
import {
	ImportFormat,
	importFormatOf,
} from "#bulk-import/value-objects/import-format";
import { ImportTarget } from "#bulk-import/value-objects/import-target";
import { Actor } from "#core/actor/actor";
import { Gate } from "#core/authorization/gates";
import { IdGenerator } from "#core/services/id-generator";
import { UseCase } from "#core/use-case/make-use-case";

function rejected(reason: ImportFileRejectedError["reason"]) {
	return Effect.fail(new ImportFileRejectedError({ reason }));
}

function userIdOf(actor: Actor) {
	return actor._tag === "StaffActor" || actor._tag === "UserActor"
		? actor.userId
		: null;
}

export const CreateImportDraftUseCase = UseCase.make({
	name: "bulk-import.create-import-draft",
	input: Schema.Struct({
		actor: Actor,
		payload: Schema.Struct({
			target: ImportTarget,
			targetId: Schema.NullOr(Schema.String),
			targetLabel: Schema.NullOr(Schema.String),
			fileName: Schema.String,
			// Taken from the file name's extension when left out.
			format: Schema.optional(ImportFormat),
			content: Schema.Uint8ArrayFromBase64,
		}),
	}),
	gate: Gate.staff(),
	execute: ({ actor, payload }) =>
		Effect.gen(function* () {
			const limits = yield* ImportLimits;
			if (payload.content.length > limits.maxBytes)
				return yield* rejected("TooLarge");

			const format = payload.format ?? importFormatOf(payload.fileName);
			const reader = (yield* ImportReaders).find(
				(candidate) => candidate.format === format,
			);
			if (format === undefined || reader === undefined)
				return yield* rejected("UnsupportedFormat");

			const schema = yield* requireImportSchema(payload.target);
			const decoded = decodeImportTable(
				schema,
				yield* reader.read(payload.content),
			);
			if (decoded.rows.length === 0) return yield* rejected("Empty");
			if (decoded.rows.length > limits.maxRows)
				return yield* rejected("TooManyRows");

			const draft = yield* ImportDraft.create({
				id: ImportDraftId.make(yield* (yield* IdGenerator).generate()),
				target: payload.target,
				targetId: payload.targetId,
				targetLabel: payload.targetLabel,
				createdByUserId: userIdOf(actor),
				fileName: payload.fileName,
				format,
				rows: decoded.rows,
				missingColumns: decoded.missingColumns,
				lifetimeDays: limits.draftLifetimeDays,
			});
			return yield* (yield* ImportDraftRepository).save(draft);
		}),
});
