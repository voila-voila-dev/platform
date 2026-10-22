import { describe, expect, it } from "bun:test";
import { keptTemplate, keptUppercase } from "./address-template.ts";

describe("keptTemplate", () => {
	it("drops name and organisation lines", () => {
		expect(keptTemplate("%N%n%O%n%A%n%Z %C")).toBe("%A%n%Z %C");
	});

	it("drops a field with the separator in front of it", () => {
		expect(keptTemplate("%A%n%C %S %Z")).toBe("%A%n%C %Z");
		expect(keptTemplate("%A%n%C, %S %Z")).toBe("%A%n%C %Z");
		expect(keptTemplate("%A%n%C-%S%n%Z")).toBe("%A%n%C%n%Z");
		expect(keptTemplate("%A%n%Z %C %X")).toBe("%A%n%Z %C");
	});

	it("keeps literal prefixes", () => {
		expect(keptTemplate("%O%n%N%n%A%nL-%Z %C")).toBe("%A%nL-%Z %C");
		expect(keptTemplate("〒%Z%n%S%C%n%A%n%O%n%N")).toBe("〒%Z%n%C%n%A");
	});
});

describe("keptUppercase", () => {
	it("keeps only the fields the Address has", () => {
		expect(keptUppercase("CX")).toBe("C");
		expect(keptUppercase("S")).toBeUndefined();
	});
});
