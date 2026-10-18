import { DateTime, Effect, Schema } from "effect";
import { Actor } from "#core/actor/actor";
import { Gate } from "#core/authorization/gates";
import { IdGenerator } from "#core/services/id-generator";
import { SecureRandom } from "#core/services/secure-random";
import { UseCase } from "#core/use-case/make-use-case";
import { TrackedLink } from "#link-tracking/link/aggregates/tracked-link";
import { LINK_CODE_BYTE_LENGTH } from "#link-tracking/link/constants/link-code-byte-length";
import { TrackedLinkRepository } from "#link-tracking/link/services/tracked-link-repository";
import { LinkCode } from "#link-tracking/link/value-objects/link-code";
import { TrackedLinkId } from "#link-tracking/link/value-objects/tracked-link-id";

export const CreateTrackedLinkUseCase = UseCase.make({
	name: "link-tracking.create-tracked-link",
	input: Schema.Struct({
		actor: Actor,
		payload: Schema.Struct({
			label: Schema.NonEmptyString,
			destinationUrl: Schema.NonEmptyString,
		}),
	}),
	gate: Gate.staff(),
	execute: ({ payload }) =>
		Effect.gen(function* () {
			const ids = yield* IdGenerator;
			const random = yield* SecureRandom;
			const repository = yield* TrackedLinkRepository;

			const link = new TrackedLink({
				id: TrackedLinkId.make(yield* ids.generate()),
				code: LinkCode.make(yield* random.token(LINK_CODE_BYTE_LENGTH)),
				destinationUrl: payload.destinationUrl,
				label: payload.label,
				context: null,
				archivedAt: null,
				createdAt: yield* DateTime.now,
			});
			return yield* repository.save(link);
		}),
});
