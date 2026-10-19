import { index, jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const importDraftTable = pgTable(
	"import_draft",
	{
		id: uuid("id").notNull().primaryKey(),
		data: jsonb("data").$type<unknown>().notNull(),
		expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
	},
	(table) => [index("import_draft_expires_at_idx").on(table.expiresAt)],
);
