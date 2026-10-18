import { describe, expect, it } from "bun:test";
import { exportKeyOf, locate } from "./layout.ts";

describe("locate", () => {
	it("reads the core", () => {
		expect(locate("index.ts").module).toBeUndefined();
		expect(locate("core/ids/user-id.ts").module).toBeUndefined();
	});

	it("reads the core's adapters", () => {
		expect(locate("core/adapters/drizzle/query.ts")).toStrictEqual({
			module: undefined,
			part: { kind: "adapter", name: "drizzle" },
		});
	});

	it("reads a module's domain, contract and adapters", () => {
		expect(locate("email/use-cases/send-email.ts")).toStrictEqual({
			module: "email",
			part: { kind: "domain" },
		});
		expect(locate("email/http/api.ts")).toStrictEqual({
			module: "email",
			part: { kind: "http" },
		});
		expect(locate("email/adapters/resend/resend-sender.ts")).toStrictEqual({
			module: "email",
			part: { kind: "adapter", name: "resend" },
		});
	});

	it("reads submodules at any depth", () => {
		expect(
			locate("link-tracking/click/aggregates/link-click.ts"),
		).toStrictEqual({
			module: "link-tracking/click",
			part: { kind: "domain" },
		});
		expect(
			locate("link-tracking/click/adapters/drizzle/tables/link-click.ts"),
		).toStrictEqual({
			module: "link-tracking/click",
			part: { kind: "adapter", name: "drizzle" },
		});
		expect(locate("link-tracking/index.ts").module).toBe("link-tracking");
	});
});

describe("exportKeyOf", () => {
	it("maps each entry point to its subpath", () => {
		expect(exportKeyOf("index.ts")).toBe(".");
		expect(exportKeyOf("link-tracking/index.ts")).toBe("./link-tracking");
		expect(exportKeyOf("link-tracking/link/index.ts")).toBe(
			"./link-tracking/link",
		);
		expect(exportKeyOf("link-tracking/link/http/index.ts")).toBe(
			"./link-tracking/link/http",
		);
		expect(exportKeyOf("email/adapters/resend/index.ts")).toBe(
			"./email/resend",
		);
		expect(exportKeyOf("core/adapters/drizzle/index.ts")).toBe("./drizzle");
	});

	it("leaves the other files out", () => {
		expect(exportKeyOf("core/index.ts")).toBeUndefined();
		expect(exportKeyOf("email/use-cases/index.ts")).toBeUndefined();
		expect(exportKeyOf("email/adapters/resend/client.ts")).toBeUndefined();
	});
});
