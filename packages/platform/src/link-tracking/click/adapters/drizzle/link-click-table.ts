import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// `link_id` has no foreign key: modules refer to each other by id only.
export const linkClickTable = pgTable(
	"link_click",
	{
		id: uuid("id").notNull().primaryKey(),
		linkId: uuid("link_id").notNull(),
		userAgent: text("user_agent"),
		referrer: text("referrer"),
		clickedAt: timestamp("clicked_at", { withTimezone: true }).notNull(),
	},
	(table) => [index("link_click_link_id_idx").on(table.linkId)],
);
