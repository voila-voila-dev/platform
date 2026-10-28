/** One block of a description as the page lays it out. */
export type DescriptionBlock =
	| { readonly kind: "paragraph"; readonly text: string }
	| { readonly kind: "heading"; readonly text: string }
	| { readonly kind: "list"; readonly items: ReadonlyArray<string> };

const BULLET = /^\s*[-–•*]\s+/u;

function isBullet(line: string): boolean {
	return BULLET.test(line);
}

function itemsOf(lines: ReadonlyArray<string>): ReadonlyArray<string> {
	return lines.map((line) => line.replace(BULLET, "").trim());
}

/** A run of lines between blank lines: a short title over its list reads as a heading and a list. */
function blocksOf(
	lines: ReadonlyArray<string>,
): ReadonlyArray<DescriptionBlock> {
	const [first, ...rest] = lines;
	if (first === undefined) return [];
	if (rest.length > 0 && !isBullet(first) && rest.every(isBullet)) {
		return [
			{ kind: "heading", text: first.trim() },
			{ kind: "list", items: itemsOf(rest) },
		];
	}
	if (lines.every(isBullet)) return [{ kind: "list", items: itemsOf(lines) }];
	return [{ kind: "paragraph", text: lines.join("\n").trim() }];
}

/**
 * A description written as plain text, read the way its author laid it out:
 * blank lines part the blocks, "- " starts a list item, and the line right
 * above a list titles it.
 */
export function descriptionBlocks(
	description: string,
): ReadonlyArray<DescriptionBlock> {
	return description
		.split(/\n\s*\n/u)
		.map((chunk) => chunk.split("\n").filter((line) => line.trim() !== ""))
		.flatMap(blocksOf);
}
