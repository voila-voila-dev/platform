import { describe, expect, it } from "vitest";
import {
	xPostIdFrom,
	youtubeVideoIdFrom,
} from "#/content-editor/lib/embeds.ts";

describe("youtubeVideoIdFrom", () => {
	it("accepts an id and every URL shape", () => {
		expect(youtubeVideoIdFrom("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
		expect(
			youtubeVideoIdFrom(" https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1 "),
		).toBe("dQw4w9WgXcQ");
		expect(youtubeVideoIdFrom("https://youtu.be/dQw4w9WgXcQ")).toBe(
			"dQw4w9WgXcQ",
		);
		expect(
			youtubeVideoIdFrom("https://www.youtube.com/shorts/dQw4w9WgXcQ"),
		).toBe("dQw4w9WgXcQ");
		expect(
			youtubeVideoIdFrom("https://www.youtube.com/embed/dQw4w9WgXcQ"),
		).toBe("dQw4w9WgXcQ");
	});

	it("refuses anything else", () => {
		expect(youtubeVideoIdFrom("https://vimeo.com/1234567")).toBeNull();
		expect(youtubeVideoIdFrom("")).toBeNull();
	});
});

describe("xPostIdFrom", () => {
	it("accepts an id and both domains", () => {
		expect(xPostIdFrom("1234567890123")).toBe("1234567890123");
		expect(xPostIdFrom("https://x.com/voila/status/1234567890123?s=20")).toBe(
			"1234567890123",
		);
		expect(xPostIdFrom("https://twitter.com/voila/status/1234567890123")).toBe(
			"1234567890123",
		);
	});

	it("refuses a profile URL", () => {
		expect(xPostIdFrom("https://x.com/voila")).toBeNull();
	});
});
