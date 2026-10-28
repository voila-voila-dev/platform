import { Effect, Option } from "effect";
import { CurrentDatabase } from "#core/adapters/drizzle/current-database";
import type { AnyDrizzleDatabase } from "#core/adapters/drizzle/drizzle-database";
import { DatabaseError } from "#core/errors/database-error";

function describeCauseChain(cause: unknown): string {
	const parts: Array<string> = [];
	let current: unknown = cause;
	while (current !== undefined && current !== null) {
		parts.push(String(current));
		current = current instanceof Error ? current.cause : undefined;
	}
	return parts.join("\ncaused by: ");
}

function tryQuery<A>(run: () => Promise<A>): Effect.Effect<A, DatabaseError> {
	return Effect.tryPromise({
		try: run,
		catch: (cause) => new DatabaseError({ message: describeCauseChain(cause) }),
	});
}

export function query<A>(
	run: () => Promise<A>,
): Effect.Effect<A, DatabaseError>;
export function query<A, Database extends AnyDrizzleDatabase>(
	database: Database,
	run: (database: Database) => Promise<A>,
): Effect.Effect<A, DatabaseError>;
export function query<A, Database extends AnyDrizzleDatabase>(
	first: Database | (() => Promise<A>),
	run?: (database: Database) => Promise<A>,
): Effect.Effect<A, DatabaseError> {
	if (typeof first === "function") return tryQuery(first);
	if (run === undefined)
		return Effect.die(new Error("query: a database comes with its callback"));
	return Effect.flatMap(Effect.service(CurrentDatabase), (current) =>
		tryQuery(() => run(Option.getOrElse(current, () => first) as Database)),
	);
}
