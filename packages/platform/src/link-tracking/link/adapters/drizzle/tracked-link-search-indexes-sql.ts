// Drizzle cannot declare an index on `immutable_unaccent(column)`, so these
// go in a migration of their own, after `searchFunctionsSql`.
export const trackedLinkSearchIndexesSql = `CREATE INDEX IF NOT EXISTS "tracked_link_label_search_index"
	ON "tracked_link" USING gin (immutable_unaccent("label") gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "tracked_link_destination_url_search_index"
	ON "tracked_link" USING gin (immutable_unaccent("destination_url") gin_trgm_ops);
`;
