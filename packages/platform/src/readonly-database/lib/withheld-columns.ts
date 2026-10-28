// The database role withholds these columns with column grants; this check
// explains the refusal before the query runs.
export type WithheldColumns = Readonly<Record<string, ReadonlyArray<string>>>;

const STRING_LITERAL = /'(?:[^']|'')*'|\$([a-z_]*)\$[\s\S]*?\$\1\$/giu;

const TOKEN = /"(?:[^"]|"")*"|[a-z_][a-z0-9_$]*|::|[^\s\w]|\d+/giu;

// Clause keywords: the first one found walking back says where a token sits.
const CLAUSES = new Set([
	"select",
	"from",
	"join",
	"where",
	"on",
	"group",
	"order",
	"having",
	"limit",
	"window",
	"union",
	"except",
	"intersect",
]);

const NOT_AN_ALIAS = new Set([
	...CLAUSES,
	"inner",
	"left",
	"right",
	"full",
	"cross",
	"natural",
	"lateral",
	"using",
	"offset",
	"fetch",
	"for",
	"tablesample",
]);

const PARENTHESIS_DEPTH: Readonly<Record<string, number>> = { ")": 1, "(": -1 };

const STAR_FOLLOWS = new Set(["select", "distinct", "all", ",", "."]);

function tokenize(sql: string): ReadonlyArray<string> {
	return (sql.replace(STRING_LITERAL, "''").match(TOKEN) ?? []).map((token) =>
		token.startsWith('"')
			? token.slice(1, -1).replace(/""/gu, '"').toLowerCase()
			: token.toLowerCase(),
	);
}

function clauseAt(tokens: ReadonlyArray<string>, index: number): string {
	let depth = 0;
	for (let cursor = index - 1; cursor >= 0; cursor--) {
		const token = tokens[cursor] ?? "";
		depth += PARENTHESIS_DEPTH[token] ?? 0;
		if (depth < 0) return "(";
		if (depth === 0 && CLAUSES.has(token)) return token;
	}
	return "";
}

function isRelationPosition(
	tokens: ReadonlyArray<string>,
	index: number,
): boolean {
	const start = tokens[index - 1] === "." ? index - 2 : index;
	const previous = tokens[start - 1];
	if (previous === "from" || previous === "join" || previous === "only") {
		return true;
	}
	return previous === "," && clauseAt(tokens, start) === "from";
}

function aliasIndexes(
	tokens: ReadonlyArray<string>,
	table: string,
): ReadonlyArray<number> {
	return tokens.flatMap((token, index) => {
		if (token !== table || !isRelationPosition(tokens, index)) return [];
		const aliasIndex = tokens[index + 1] === "as" ? index + 2 : index + 1;
		const alias = tokens[aliasIndex] ?? "";
		return /^[a-z_]/u.test(alias) && !NOT_AN_ALIAS.has(alias)
			? [aliasIndex]
			: [];
	});
}

function isColumnReference(
	tokens: ReadonlyArray<string>,
	index: number,
): boolean {
	return tokens[index - 1] === "." || tokens[index + 1] === ".";
}

function selectsEveryColumn(tokens: ReadonlyArray<string>): boolean {
	return tokens.some(
		(token, index) =>
			token === "*" && STAR_FOLLOWS.has(tokens[index - 1] ?? ""),
	);
}

// The table, or one of its aliases, used as a value: `to_jsonb(r)`,
// `select r from …` read the whole row, the withheld columns included. A
// column alias list (`mission_report r(a, b)`) renames them out of sight.
function readsWholeRowOrRenames(
	tokens: ReadonlyArray<string>,
	table: string,
): boolean {
	const declarations = aliasIndexes(tokens, table);
	if (declarations.some((index) => tokens[index + 1] === "(")) return true;
	const names = new Set([
		table,
		...declarations.map((index) => tokens[index] ?? ""),
	]);
	const declared = new Set(declarations);
	return tokens.some(
		(token, index) =>
			names.has(token) &&
			!declared.has(index) &&
			!isColumnReference(tokens, index) &&
			!(token === table && isRelationPosition(tokens, index)),
	);
}

function refusal(
	tokens: ReadonlyArray<string>,
	table: string,
	columns: ReadonlyArray<string>,
): string | null {
	if (!tokens.includes(table)) return null;
	const column = tokens.find((token) => columns.includes(token));
	if (column !== undefined) {
		return `${table}.${column} is never read: select the other columns of ${table} by name, in a query that names no column called ${column}`;
	}
	if (selectsEveryColumn(tokens)) {
		return `a query over ${table} names its columns: "*" would read ${columns.join(", ")}`;
	}
	if (readsWholeRowOrRenames(tokens, table)) {
		return `a query over ${table} reads its columns by name, never the whole row or a renamed column list`;
	}
	return null;
}

export function withheldColumnRead(
	sql: string,
	withheld: WithheldColumns,
): string | null {
	const tokens = tokenize(sql);
	for (const [table, columns] of Object.entries(withheld)) {
		const reason = refusal(tokens, table, columns);
		if (reason !== null) return reason;
	}
	return null;
}
