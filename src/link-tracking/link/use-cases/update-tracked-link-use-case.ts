import { Effect, Option, Schema } from "effect";
import { Actor } from "#core/actor/actor";
import { Gate } from "#core/authorization/gates";
import { UseCase } from "#core/use-case/make-use-case";
import { TrackedLinkNotFoundError } from "#link-tracking/link/errors/tracked-link-not-found-error";
import { TrackedLinkRepository } from "#link-tracking/link/services/tracked-link-repository";
import { TrackedLinkId } from "#link-tracking/link/value-objects/tracked-link-id";

export const UpdateTrackedLinkUseCase = UseCase.make({
	name: "link-tracking.update-tracked-link",
	input: Schema.Struct({
		actor: Actor,
		payload: Schema.Struct({
			id: TrackedLinkId,
			label: Schema.NonEmptyString,
			destinationUrl: Schema.NonEmptyString,
		}),
	}),
	gate: Gate.staff(),
	execute: ({ payload }) =>
		Effect.gen(function* () {
			const repository = yield* TrackedLinkRepository;
			const found = yield* repository.get(payload.id);
			if (Option.isNone(found))
				return yield* new TrackedLinkNotFoundError({ id: payload.id });

			return yield* repository.save(
				found.value.editTarget({
					destinationUrl: payload.destinationUrl,
					label: payload.label,
				}),
			);
		}),
});
