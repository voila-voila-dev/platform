import { describe, expect, it } from "bun:test";
import { DateTime, Option } from "effect";
import { TIME_ZONES } from "#time-zone/value-objects/time-zone";

describe("TIME_ZONES", () => {
	it("contains only valid IANA zone identifiers", () => {
		for (const zone of TIME_ZONES) {
			expect(Option.isSome(DateTime.zoneMakeNamed(zone)), zone).toBe(true);
		}
	});
});
