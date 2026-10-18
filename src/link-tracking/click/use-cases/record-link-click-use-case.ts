import { DateTime, Effect, Option, Schema } from "effect";
import { Actor } from "#core/actor/actor";
import { Gate } from "#core/authorization/gates";
import { IdGenerator } from "#core/services/id-generator";
import { UseCase } from "#core/use-case/make-use-case";
import { LinkClick } from "#link-tracking/click/aggregates/link-click";
import { isWebUrl } from "#link-tracking/click/lib/is-web-url";
import { LinkClickRepository } from "#link-tracking/click/services/link-click-repository";
import { LinkClickId } from "#link-tracking/click/value-objects/link-click-id";
import { TrackedLinkRepository } from "#link-tracking/link/services/tracked-link-repository";
import { LinkCode } from "#link-tracking/link/value-objects/link-code";

export const RecordLinkClickUseCase = UseCase.make({
	name: "link-tracking.record-link-click",
	input: Schema.Struct({
		actor: Actor,
		payload: Schema.Struct({
			code: LinkCode,
			userAgent: Schema.NullOr(Schema.String),
			referrer: Schema.NullOr(Schema.String),
		}),
	}),
	gate: Gate.anyone(),
	execute: ({ payload }) =>
		Effect.gen(function* () {
			const found = yield* (yield* TrackedLinkRepository).findByCode(
				payload.code,
			);
			if (
				Option.isNone(found) ||
				found.value.isArchived ||
				!isWebUrl(found.value.destinationUrl)
			)
				return Option.none();
			const link = found.value;

			const clickId = LinkClickId.make(yield* (yield* IdGenerator).generate());
			yield* (yield* LinkClickRepository).save(
				new LinkClick({
					id: clickId,
					linkId: link.id,
					userAgent: payload.userAgent,
					referrer: payload.referrer,
					clickedAt: yield* DateTime.now,
				}),
			);

			return Option.some({ destinationUrl: link.destinationUrl, clickId });
		}),
});
