import { describe, expect, it } from "bun:test";
import { isPrivateAddress } from "#http/adapters/bun/private-address";

describe("isPrivateAddress", () => {
	it.each([
		"127.0.0.1",
		"10.1.2.3",
		"172.16.0.1",
		"192.168.1.1",
		"169.254.169.254",
		"100.64.0.1",
		"0.0.0.0",
		"255.255.255.255",
		"::1",
		"fe80::1",
		"fd00::1",
		"::ffff:127.0.0.1",
		"2001:db8::1",
		"2002::1",
		"not an address",
	])("refuses %s", (address) => {
		expect(isPrivateAddress(address)).toBe(true);
	});

	it.each(["93.184.216.34", "8.8.8.8", "2606:2800:220:1::1"])(
		"lets %s through",
		(address) => {
			expect(isPrivateAddress(address)).toBe(false);
		},
	);
});
