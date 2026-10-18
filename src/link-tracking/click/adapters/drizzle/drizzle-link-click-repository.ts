import { asc, count, eq, gte, inArray, max, sql } from "drizzle-orm";
import { DateTime, Effect, Layer } from "effect";
import { DrizzleDatabase } from "#core/adapters/drizzle/drizzle-database";
import { query } from "#core/adapters/drizzle/query";
import { linkClickTable } from "#link-tracking/click/adapters/drizzle/link-click-table";
import { LinkClick } from "#link-tracking/click/aggregates/link-click";
import { LinkClickRepository } from "#link-tracking/click/services/link-click-repository";
import { LinkClickId } from "#link-tracking/click/value-objects/link-click-id";
import { TrackedLinkId } from "#link-tracking/link/value-objects/tracked-link-id";

// `max(clicked_at)` is null on a link nobody opened, undefined when no row came back.
function lastClickedAt(last: Date | null | undefined) {
	return last == null ? null : DateTime.fromDateUnsafe(last);
}

export const drizzleLinkClickRepository = Layer.effect(
	LinkClickRepository,
	Effect.gen(function* () {
		const database = yield* DrizzleDatabase;

		return {
			save: (click) =>
				query(async () => {
					await database.insert(linkClickTable).values({
						id: click.id,
						linkId: click.linkId,
						userAgent: click.userAgent,
						referrer: click.referrer,
						clickedAt: DateTime.toDate(click.clickedAt),
					});
					return click;
				}),

			listByLinkIds: (linkIds) =>
				query(async () => {
					if (linkIds.length === 0) return [];
					const rows = await database
						.select()
						.from(linkClickTable)
						.where(inArray(linkClickTable.linkId, [...linkIds]))
						.orderBy(asc(linkClickTable.clickedAt));
					return rows.map(
						(row) =>
							new LinkClick({
								id: LinkClickId.make(row.id),
								linkId: TrackedLinkId.make(row.linkId),
								userAgent: row.userAgent,
								referrer: row.referrer,
								clickedAt: DateTime.fromDateUnsafe(row.clickedAt),
							}),
					);
				}),

			countByLinkIds: (linkIds) =>
				query(async () => {
					if (linkIds.length === 0) return new Map<TrackedLinkId, number>();
					const rows = await database
						.select({ linkId: linkClickTable.linkId, clickCount: count() })
						.from(linkClickTable)
						.where(inArray(linkClickTable.linkId, [...linkIds]))
						.groupBy(linkClickTable.linkId);
					return new Map(
						rows.map((row) => [
							TrackedLinkId.make(row.linkId),
							Number(row.clickCount),
						]),
					);
				}),

			historyByLinkId: (linkId, since) =>
				query(async () => {
					const [totals] = await database
						.select({ total: count(), last: max(linkClickTable.clickedAt) })
						.from(linkClickTable)
						.where(eq(linkClickTable.linkId, linkId));
					const day = sql<string>`to_char(${linkClickTable.clickedAt} AT TIME ZONE 'UTC', 'YYYY-MM-DD')`;
					const days = await database
						.select({ day, count: count() })
						.from(linkClickTable)
						.where(
							sql`${eq(linkClickTable.linkId, linkId)} AND ${gte(linkClickTable.clickedAt, DateTime.toDate(since))}`,
						)
						.groupBy(day)
						.orderBy(day);
					return {
						total: Number(totals?.total ?? 0),
						lastClickedAt: lastClickedAt(totals?.last),
						daily: days.map((row) => ({
							day: row.day,
							count: Number(row.count),
						})),
					};
				}),
		};
	}),
);
