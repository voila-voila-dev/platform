import {
	and,
	asc,
	desc,
	eq,
	gte,
	type InferSelectModel,
	isNotNull,
	isNull,
	lte,
	or,
	type SQL,
} from "drizzle-orm";
import { DateTime, Effect, Layer, Option } from "effect";
import { DrizzleDatabase } from "#core/adapters/drizzle/drizzle-database";
import { query } from "#core/adapters/drizzle/query";
import { updateSetFromColumns } from "#core/adapters/drizzle/upsert-set";
import { trackedLinkTable } from "#link-tracking/link/adapters/drizzle/tracked-link-table";
import { TrackedLink } from "#link-tracking/link/aggregates/tracked-link";
import type { TrackedLinkFilter } from "#link-tracking/link/payloads/tracked-link-filter";
import { TrackedLinkRepository } from "#link-tracking/link/services/tracked-link-repository";
import { LinkCode } from "#link-tracking/link/value-objects/link-code";
import { TrackedLinkId } from "#link-tracking/link/value-objects/tracked-link-id";
import {
	pagedQuery,
	totalRowCount,
} from "#search/adapters/drizzle/paged-query";
import {
	conditionWhenDefined,
	definedConditions,
	everyTermCondition,
	matchesTerm,
} from "#search/adapters/drizzle/search-conditions";

type TrackedLinkRow = InferSelectModel<typeof trackedLinkTable>;

function toTrackedLink(row: TrackedLinkRow): TrackedLink {
	return new TrackedLink({
		id: TrackedLinkId.make(row.id),
		code: LinkCode.make(row.code),
		destinationUrl: row.destinationUrl,
		label: row.label,
		context: row.context,
		archivedAt:
			row.archivedAt === null ? null : DateTime.fromDateUnsafe(row.archivedAt),
		createdAt: DateTime.fromDateUnsafe(row.createdAt),
	});
}

function toRow(link: TrackedLink): TrackedLinkRow {
	return {
		id: link.id,
		code: link.code,
		destinationUrl: link.destinationUrl,
		label: link.label,
		context: link.context,
		archivedAt:
			link.archivedAt === null ? null : DateTime.toDate(link.archivedAt),
		createdAt: DateTime.toDate(link.createdAt),
	};
}

export function trackedLinkSearchCondition(
	search: string | undefined,
): SQL | undefined {
	return everyTermCondition(search, (term) =>
		or(
			matchesTerm(trackedLinkTable.label, term),
			matchesTerm(trackedLinkTable.destinationUrl, term),
		),
	);
}

export function trackedLinkSortColumn(sortBy: TrackedLinkFilter["sortBy"]) {
	return sortBy === "label"
		? trackedLinkTable.label
		: trackedLinkTable.createdAt;
}

function findOne(rows: ReadonlyArray<TrackedLinkRow>) {
	const [row] = rows;
	return row === undefined ? Option.none() : Option.some(toTrackedLink(row));
}

export const drizzleTrackedLinkRepository = Layer.effect(
	TrackedLinkRepository,
	Effect.gen(function* () {
		const database = yield* DrizzleDatabase;

		return {
			save: (link) =>
				query(async () => {
					await database
						.insert(trackedLinkTable)
						.values(toRow(link))
						.onConflictDoUpdate({
							target: trackedLinkTable.id,
							set: updateSetFromColumns(trackedLinkTable),
						});
					return link;
				}),

			get: (id) =>
				query(async () =>
					findOne(
						await database
							.select()
							.from(trackedLinkTable)
							.where(eq(trackedLinkTable.id, id))
							.limit(1),
					),
				),

			findByCode: (code) =>
				query(async () =>
					findOne(
						await database
							.select()
							.from(trackedLinkTable)
							.where(eq(trackedLinkTable.code, code))
							.limit(1),
					),
				),

			listByContext: (context) =>
				query(async () => {
					const rows = await database
						.select()
						.from(trackedLinkTable)
						.where(eq(trackedLinkTable.context, context));
					return rows.map(toTrackedLink);
				}),

			search: (filter, pagination) => {
				const conditions = definedConditions([
					isNotNull(trackedLinkTable.label),
					filter.includeArchived === true
						? undefined
						: isNull(trackedLinkTable.archivedAt),
					trackedLinkSearchCondition(filter.search),
					conditionWhenDefined(filter.createdAtFrom, (from) =>
						gte(trackedLinkTable.createdAt, DateTime.toDate(from)),
					),
					conditionWhenDefined(filter.createdAtTo, (to) =>
						lte(trackedLinkTable.createdAt, DateTime.toDate(to)),
					),
				]);
				const direction = filter.sortDirection === "asc" ? asc : desc;
				return pagedQuery({
					page: database.select().from(trackedLinkTable).$dynamic(),
					total: database
						.select(totalRowCount)
						.from(trackedLinkTable)
						.$dynamic(),
					where: conditions.length > 0 ? and(...conditions) : undefined,
					orderBy: [direction(trackedLinkSortColumn(filter.sortBy))],
					pagination,
					mapRows: (rows) => rows.map(toTrackedLink),
				});
			},
		};
	}),
);
