import { describe, expect, it } from "bun:test";
import { handOffLinkClick } from "#link-tracking/click/lib/hand-off-link-click";
import { LinkClickId } from "#link-tracking/click/value-objects/link-click-id";

const clickId = LinkClickId.make("00000000-0000-0000-0000-0000000000a1");
const options = {
	clickId,
	attributingOrigins: ["https://shop.example.com"],
	queryParameter: "click",
};

describe("handOffLinkClick", () => {
	it("hands the click to an attributing origin, keeping the campaign's own parameters", () => {
		expect(
			handOffLinkClick({
				...options,
				destinationUrl: "https://shop.example.com/?utm_source=newsletter#gel",
			}),
		).toBe(
			"https://shop.example.com/?utm_source=newsletter&click=00000000-0000-0000-0000-0000000000a1#gel",
		);
	});

	it("leaves any other destination untouched", () => {
		expect(
			handOffLinkClick({
				...options,
				destinationUrl: "https://example.com/page?x=1",
			}),
		).toBe("https://example.com/page?x=1");
	});
});
