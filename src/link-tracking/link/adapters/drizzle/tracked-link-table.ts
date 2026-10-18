import {
	index,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";

export const trackedLinkTable = pgTable(
	"tracked_link",
	{
		id: uuid("id").notNull().primaryKey(),
		code: text("code").notNull(),
		destinationUrl: text("destination_url").notNull(),
		label: text("label"),
		context: text("context"),
		archivedAt: timestamp("archived_at", { withTimezone: true }),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
	},
	(table) => [
		uniqueIndex("tracked_link_code_idx").on(table.code),
		index("tracked_link_created_at_idx").on(table.createdAt),
		index("tracked_link_context_idx").on(table.context),
	],
);
