import { expect, it } from "vitest";
import { descriptionBlocks } from "#/job-posting/lib/description-blocks.ts";

it("reads paragraphs, a titled list and a bare list", () => {
	expect(
		descriptionBlocks(
			"The team is hiring.\nA growing one.\n\nWhat you will do\n- Build.\n- Ship.\n\n• Where: Lyon.\n– Permanent.",
		),
	).toEqual([
		{ kind: "paragraph", text: "The team is hiring.\nA growing one." },
		{ kind: "heading", text: "What you will do" },
		{ kind: "list", items: ["Build.", "Ship."] },
		{ kind: "list", items: ["Where: Lyon.", "Permanent."] },
	]);
});

it("keeps a dash inside a sentence as text", () => {
	expect(descriptionBlocks("Lyon - Décines, as soon as possible.")).toEqual([
		{ kind: "paragraph", text: "Lyon - Décines, as soon as possible." },
	]);
});
