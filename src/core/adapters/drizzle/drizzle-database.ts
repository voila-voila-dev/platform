import type { AnyRelations } from "drizzle-orm";
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { Context } from "effect";

export type AnyDrizzleDatabase = PgAsyncDatabase<
	PgQueryResultHKT,
	AnyRelations
>;

export class DrizzleDatabase extends Context.Service<
	DrizzleDatabase,
	AnyDrizzleDatabase
>()("@voila.dev/platform/DrizzleDatabase") {}
