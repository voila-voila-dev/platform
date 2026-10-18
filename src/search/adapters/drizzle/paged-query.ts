import { type SQL, sql } from "drizzle-orm";
import type { PgAsyncSelect, PgColumn } from "drizzle-orm/pg-core";
import type { Effect } from "effect";
import { query } from "#core/adapters/drizzle/query";
import type { DatabaseError } from "#core/errors/database-error";
import { makePagedResult } from "#search/lib/make-paged-result";
import type { PagedResult } from "#search/value-objects/paged-result";
import type { Pagination } from "#search/value-objects/pagination";

export const totalRowCount: { readonly total: SQL<number | string> } = {
	total: sql<number | string>`count(*)`,
};

export interface PagedQueryOptions<Page extends PgAsyncSelect, Item> {
	readonly page: Page;
	readonly total: PgAsyncSelect;
	readonly where: SQL | undefined;
	readonly orderBy: ReadonlyArray<SQL | SQL.Aliased | PgColumn>;
	readonly pagination: Pagination;
	readonly mapRows: (
		rows: Page["_"]["result"],
	) => ReadonlyArray<Item> | Promise<ReadonlyArray<Item>>;
}

function parseCount(value: unknown): number {
	const parsed = Number(value);
	return Number.isSafeInteger(parsed) ? parsed : 0;
}

export function pagedQuery<Page extends PgAsyncSelect, Item>(
	options: PagedQueryOptions<Page, Item>,
): Effect.Effect<PagedResult<Item>, DatabaseError> {
	return query(async () => {
		const [pageRows, totalRows] = await Promise.all([
			options.page
				.where(options.where)
				.orderBy(...options.orderBy)
				.limit(options.pagination.take)
				.offset(options.pagination.skip),
			options.total.where(options.where),
		]);
		const [count]: ReadonlyArray<{ readonly total?: unknown }> = totalRows;
		const items = await options.mapRows(pageRows as Page["_"]["result"]);
		return makePagedResult(items, parseCount(count?.total), options.pagination);
	});
}
