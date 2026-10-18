import { Context, Option } from "effect";
import type { AnyDrizzleDatabase } from "#core/adapters/drizzle/drizzle-database";

export const CurrentDatabase = Context.Reference<
	Option.Option<AnyDrizzleDatabase>
>("@voila.dev/platform/CurrentDatabase", { defaultValue: () => Option.none() });
