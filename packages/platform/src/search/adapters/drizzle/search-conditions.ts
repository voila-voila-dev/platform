import type { SQL, SQLWrapper } from "drizzle-orm";
import { and, sql } from "drizzle-orm";
import {
	escapeLikePattern,
	foldAccents,
	searchTerms,
} from "#search/adapters/drizzle/search-terms";

export function conditionWhenDefined<Value>(
	value: Value | undefined,
	buildCondition: (value: Value) => SQL | undefined,
): SQL | undefined {
	return value === undefined ? undefined : buildCondition(value);
}

export function definedConditions(
	conditions: ReadonlyArray<SQL | undefined>,
): Array<SQL> {
	return conditions.filter(
		(condition): condition is SQL => condition !== undefined,
	);
}

export function matchesTerm(column: SQLWrapper, term: string): SQL {
	return sql`immutable_unaccent(${column}) ILIKE ${`%${escapeLikePattern(foldAccents(term))}%`}`;
}

export function everyTermCondition(
	search: string | undefined,
	buildTermCondition: (term: string) => SQL | undefined,
): SQL | undefined {
	const conditions = definedConditions(
		searchTerms(search).map(buildTermCondition),
	);
	return conditions.length === 0 ? undefined : and(...conditions);
}
