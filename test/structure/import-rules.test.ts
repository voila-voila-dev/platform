import { describe, expect, it } from "bun:test";
import {
	importViolations,
	undeclaredPackages,
	unusedDependencies,
} from "./import-rules.ts";

const ADAPTER_PACKAGES = ["drizzle-orm", "resend"];
const CLICK_NEEDS_LINK = [
	["link-tracking/click", "link-tracking/link"],
] as const;

function violations(
	path: string,
	imports: ReadonlyArray<string>,
	dependencies: ReadonlyArray<readonly [string, string]> = [],
) {
	return importViolations([{ path, imports }], dependencies, ADAPTER_PACKAGES);
}

describe("importViolations", () => {
	it("refuses relative imports", () => {
		expect(
			violations("email/use-cases/send.ts", ["../services/sender.ts"]),
		).toStrictEqual([
			"email/use-cases/send.ts imports ../services/sender.ts: import it through #, not a relative path",
		]);
		expect(
			violations("email/use-cases/send.ts", ["#email/services/sender"]),
		).toStrictEqual([]);
	});

	it("keeps the core free of modules", () => {
		expect(violations("index.ts", ["#email/index"])).toHaveLength(1);
		expect(violations("core/ids/user-id.ts", ["#email/index"])).toHaveLength(1);
		expect(
			violations("index.ts", ["#core/ids/user-id", "effect"]),
		).toStrictEqual([]);
	});

	it("keeps runtime modules and adapter libraries out of a domain and its contract", () => {
		expect(violations("email/use-cases/send.ts", ["node:crypto"])).toHaveLength(
			1,
		);
		expect(violations("email/use-cases/send.ts", ["bun"])).toHaveLength(1);
		expect(
			violations("email/http/api.ts", ["drizzle-orm/pg-core"]),
		).toHaveLength(1);
		expect(violations("email/services/sender.ts", ["resend"])).toHaveLength(1);
		expect(
			violations("email/services/sender.ts", [
				"effect",
				"effect/unstable/http",
			]),
		).toStrictEqual([]);
	});

	it("lets an adapter use whatever its technology needs", () => {
		expect(
			violations("email/adapters/resend/sender.ts", [
				"resend",
				"node:crypto",
				"#email/services/sender",
				"#email/adapters/resend/client",
				"#core/ids/user-id",
			]),
		).toStrictEqual([]);
		expect(
			violations("link-tracking/link/adapters/http-server/handlers.ts", [
				"#link-tracking/link/http/api",
			]),
		).toStrictEqual([]);
	});

	it("keeps adapters out of a domain, and apart from each other", () => {
		expect(
			violations("email/use-cases/send.ts", ["#email/adapters/resend/index"]),
		).toHaveLength(1);
		expect(
			violations("email/adapters/ses/sender.ts", [
				"#email/adapters/resend/client",
			]),
		).toHaveLength(1);
		expect(
			violations("link-tracking/click/adapters/drizzle/tables.ts", [
				"#link-tracking/link/adapters/drizzle/tables",
			]),
		).toHaveLength(1);
		expect(
			violations(
				"link-tracking/click/adapters/drizzle/tables.ts",
				["#link-tracking/link/adapters/drizzle/tables"],
				CLICK_NEEDS_LINK,
			),
		).toStrictEqual([]);
		expect(
			violations(
				"link-tracking/click/adapters/drizzle/tables.ts",
				["#link-tracking/link/adapters/memory/repository"],
				CLICK_NEEDS_LINK,
			),
		).toHaveLength(1);
	});

	it("lets an adapter use the core's adapter of the same name, and nothing else of the core's adapters", () => {
		expect(
			violations("link-tracking/link/adapters/drizzle/repository.ts", [
				"#core/adapters/drizzle/query",
			]),
		).toStrictEqual([]);
		expect(
			violations("link-tracking/link/adapters/drizzle/repository.ts", [
				"#core/adapters/memory/in-memory-entity-store",
			]),
		).toHaveLength(1);
		expect(
			violations("link-tracking/link/use-cases/create.ts", [
				"#core/adapters/memory/in-memory-entity-store",
			]),
		).toHaveLength(1);
		expect(
			violations("core/adapters/drizzle/paged-query.ts", [
				"drizzle-orm",
				"#core/search/value-objects/pagination",
				"#core/adapters/drizzle/query",
			]),
		).toStrictEqual([]);
		expect(
			violations("core/adapters/drizzle/query.ts", ["#core/adapters/bun/id"]),
		).toHaveLength(1);
		expect(
			violations("core/ids/id.ts", ["#core/adapters/bun/id"]),
		).toHaveLength(1);
		expect(
			violations("core/adapters/memory/store.ts", ["#link-tracking/index"]),
		).toHaveLength(1);
	});

	it("asks for a declared dependency between modules", () => {
		const click = "link-tracking/click/aggregates/link-click.ts";
		const linkId = "#link-tracking/link/value-objects/tracked-link-id";
		expect(violations(click, [linkId])).toHaveLength(1);
		expect(violations(click, [linkId], CLICK_NEEDS_LINK)).toStrictEqual([]);
		expect(
			violations(
				"link-tracking/click/adapters/drizzle/repository.ts",
				[linkId],
				CLICK_NEEDS_LINK,
			),
		).toStrictEqual([]);
	});

	it("lets a module re-export its submodules", () => {
		expect(
			violations("link-tracking/index.ts", [
				"#link-tracking/link/index",
				"#link-tracking/click/index",
			]),
		).toStrictEqual([]);
	});
});

describe("unusedDependencies", () => {
	it("reports a declared dependency no import uses", () => {
		const files = [
			{
				path: "link-tracking/click/aggregates/link-click.ts",
				imports: ["#link-tracking/link/value-objects/tracked-link-id"],
			},
		];
		expect(
			unusedDependencies(files, [
				...CLICK_NEEDS_LINK,
				["email", "link-tracking/link"],
			]),
		).toStrictEqual(["email → link-tracking/link"]);
	});
});

describe("undeclaredPackages", () => {
	it("reports a package that is not a peer dependency", () => {
		const files = [
			{
				path: "email/adapters/resend/sender.ts",
				imports: [
					"resend",
					"@aws-sdk/client-sesv2",
					"effect/Schema",
					"node:crypto",
					"bun",
					"#email/services/sender",
					"./client.ts",
				],
			},
		];
		expect(undeclaredPackages(files, ["effect", "resend"])).toStrictEqual([
			"email/adapters/resend/sender.ts imports @aws-sdk/client-sesv2",
		]);
	});
});
