// libaddressinput fields the location brick's Address has: street, city, postal code.
const KEPT_FIELDS = new Set(["A", "C", "Z"]);

const SEPARATORS = /[\s,\-–]+$/u;

function keptLine(line: string): string {
	const parts = line.split(/(%[A-Za-z])/u);
	let kept = "";
	for (const part of parts) {
		const field = part.match(/^%([A-Za-z])$/u)?.[1];
		if (field === undefined) kept += part;
		else if (KEPT_FIELDS.has(field)) kept += part;
		else kept = kept.replace(SEPARATORS, "");
	}
	return kept.replace(/^[\s,\-–]+/u, "").replace(SEPARATORS, "");
}

// Drops the fields the Address does not have, with the separator in front of each.
export function keptTemplate(template: string): string {
	return template
		.split("%n")
		.map(keptLine)
		.filter((line) => /%[ACZ]/u.test(line))
		.join("%n");
}

export function keptUppercase(fields: string | undefined): string | undefined {
	const kept = [...(fields ?? "")].filter((field) => KEPT_FIELDS.has(field));
	return kept.length === 0 ? undefined : kept.join("");
}
