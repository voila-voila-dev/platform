import { integer, jsonb, pgTable, uuid } from "drizzle-orm/pg-core";

export const importIntentTable = pgTable("import_intent", {
	id: uuid("id").notNull().primaryKey(),
	// Mirrors the intent's own, for updates to check atomically.
	version: integer("version").notNull(),
	data: jsonb("data").$type<unknown>().notNull(),
});
