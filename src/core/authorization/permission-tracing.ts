import { Effect, Option, type Tracer } from "effect";
import {
	type PermissionRef,
	renderPermissionRef,
} from "#core/authorization/permission-ref";

export const PERMISSION_CHECKED_ATTRIBUTE = "permission.checked";

const SEPARATOR = ",";

export function splitPermissionChecked(value: unknown): ReadonlyArray<string> {
	return typeof value === "string" && value.length > 0
		? value.split(SEPARATOR)
		: [];
}

function alreadyChecked(span: Tracer.Span): ReadonlyArray<string> {
	return splitPermissionChecked(
		span.attributes.get(PERMISSION_CHECKED_ATTRIBUTE),
	);
}

function recordOn(
	span: Tracer.Span,
	permissions: ReadonlyArray<PermissionRef>,
): Effect.Effect<void> {
	return Effect.annotateCurrentSpan(
		PERMISSION_CHECKED_ATTRIBUTE,
		[...alreadyChecked(span), ...permissions.map(renderPermissionRef)].join(
			SEPARATOR,
		),
	);
}

export function checked(permissions: ReadonlyArray<PermissionRef>) {
	return <A, E, R>(fence: Effect.Effect<A, E, R>): Effect.Effect<A, E, R> =>
		Effect.option(Effect.currentSpan).pipe(
			Effect.flatMap(
				Option.match({
					onNone: () => Effect.void,
					onSome: (span) => recordOn(span, permissions),
				}),
			),
			Effect.andThen(fence),
		);
}
