import { Effect } from "effect";
import { QueryRejectedError } from "#readonly-database/errors/query-rejected-error";
import {
	type WithheldColumns,
	withheldColumnRead,
} from "#readonly-database/lib/withheld-columns";

export const MAX_QUERY_ROWS = 200;

export interface QueryPolicy {
	readonly tables: ReadonlySet<string>;
	readonly withheldColumns?: WithheldColumns;
	readonly maxRows?: number;
}

const FORBIDDEN =
	/\b(insert|update|delete|drop|alter|create|truncate|grant|revoke|copy|vacuum|analyze|lock|call|do|execute|prepare|listen|notify|set|reset|refresh|reindex|cluster|comment|security|pg_sleep|pg_read_file|pg_ls_dir|lo_import|lo_export|dblink)\b|\b\w*_to_xml\w*\b/iu;

const TABLE_REFERENCE =
	/\b(?:from|join)\s+(?:only\s+)?(?:"?([a-z_][a-z0-9_]*)"?\.)?"?([a-z_][a-z0-9_]*)"?/giu;

function stripComments(sql: string): string {
	return sql.replace(/--.*$/gmu, "").replace(/\/\*[\s\S]*?\*\//gu, "");
}

function cteNames(sql: string): ReadonlySet<string> {
	return new Set(
		[...sql.matchAll(/\b([a-z_][a-z0-9_]*)\s+as\s*\(/giu)].map((match) =>
			(match[1] ?? "").toLowerCase(),
		),
	);
}

export function referencedTables(sql: string): ReadonlyArray<string> {
	const cleaned = stripComments(sql);
	const ctes = cteNames(cleaned);
	const names = new Set<string>();
	for (const match of cleaned.matchAll(TABLE_REFERENCE)) {
		const schema = match[1]?.toLowerCase();
		const name = (match[2] ?? "").toLowerCase();
		if (schema !== undefined && schema !== "public") {
			names.add(`${schema}.${name}`);
		} else if (!ctes.has(name)) {
			names.add(name);
		}
	}
	return [...names];
}

function trailingLimit(sql: string): number | null {
	const match = /\blimit\s+(\d+)\s*(?:offset\s+\d+\s*)?$/iu.exec(sql);
	return match ? Number(match[1]) : null;
}

function rejection(
	sql: string,
	policy: QueryPolicy,
): string | { readonly sql: string } {
	if (sql.length === 0) return "empty query";
	if (sql.includes(";")) return "one statement per query";
	if (!/^(select|with)\b/iu.test(sql)) {
		return "only SELECT (or WITH … SELECT) statements are allowed";
	}
	const forbidden = sql.match(FORBIDDEN);
	if (forbidden) return `"${forbidden[0]}" is not allowed in a read-only query`;
	const outside = referencedTables(sql).filter(
		(table) => !policy.tables.has(table),
	);
	if (outside.length > 0) {
		return `table(s) not in the allowlist: ${outside.join(", ")}`;
	}
	const withheldRead = withheldColumnRead(sql, policy.withheldColumns ?? {});
	if (withheldRead !== null) return withheldRead;
	const maxRows = policy.maxRows ?? MAX_QUERY_ROWS;
	const limit = trailingLimit(sql);
	if (limit === null) return { sql: `${sql} LIMIT ${maxRows}` };
	if (limit > maxRows) {
		return { sql: sql.replace(/\blimit\s+\d+/iu, `LIMIT ${maxRows}`) };
	}
	return { sql };
}

// The database role enforces the same posture server-side; this guard exists
// so the refusal is explained to the caller rather than surfacing as a
// permission error.
export function guardQuery(
	rawSql: string,
	policy: QueryPolicy,
): Effect.Effect<string, QueryRejectedError> {
	const sql = stripComments(rawSql)
		.trim()
		.replace(/;+\s*$/u, "");
	const result = rejection(sql, policy);
	return typeof result === "string"
		? Effect.fail(new QueryRejectedError({ message: result }))
		: Effect.succeed(result.sql);
}
