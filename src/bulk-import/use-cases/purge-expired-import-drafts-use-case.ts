import { DateTime, Effect, Schema } from "effect";
import { ImportDraftRepository } from "#bulk-import/services/import-draft-repository";
import { Actor } from "#core/actor/actor";
import { Gate } from "#core/authorization/gates";
import { UseCase } from "#core/use-case/make-use-case";

export const PurgeExpiredImportDraftsUseCase = UseCase.make({
	name: "bulk-import.purge-expired-import-drafts",
	input: Schema.Struct({ actor: Actor }),
	gate: Gate.system(),
	execute: () =>
		Effect.gen(function* () {
			const repository = yield* ImportDraftRepository;
			return { drafts: yield* repository.deleteExpired(yield* DateTime.now) };
		}),
});
