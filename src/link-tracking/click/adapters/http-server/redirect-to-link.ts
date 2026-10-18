import { Effect, Option } from "effect";
import { HttpServerResponse } from "effect/http";
import { ReadOnlyActor } from "#core/actor/read-only-actor";
import { handOffLinkClick } from "#link-tracking/click/lib/hand-off-link-click";
import { RecordLinkClickUseCase } from "#link-tracking/click/use-cases/record-link-click-use-case";
import { LinkCode } from "#link-tracking/link/value-objects/link-code";

export interface RedirectToLinkOptions {
	readonly attributingOrigins: ReadonlyArray<string>;
	readonly queryParameter: string;
}

// The application routes `/{code}` here, however it mounts the short-link domain.
export function redirectToLink(
	visit: {
		readonly code: string;
		readonly userAgent: string | null;
		readonly referrer: string | null;
	},
	options: RedirectToLinkOptions,
) {
	return Effect.gen(function* () {
		const click = yield* RecordLinkClickUseCase.execute({
			actor: new ReadOnlyActor(),
			payload: {
				code: LinkCode.make(visit.code),
				userAgent: visit.userAgent,
				referrer: visit.referrer,
			},
		});
		return Option.match(click, {
			onNone: () => HttpServerResponse.text("not found", { status: 404 }),
			onSome: (found) =>
				HttpServerResponse.redirect(
					handOffLinkClick({ ...found, ...options }),
					{ status: 302 },
				),
		});
	});
}
