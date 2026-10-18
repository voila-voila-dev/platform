const MAX_TERMS = 5;

const MAX_TERM_LENGTH = 64;

const DIACRITICS = /\p{Diacritic}/gu;

export function deburr(value: string): string {
	return value.normalize("NFD").replace(DIACRITICS, "");
}

export function searchTerms(
	search: string | undefined | null,
): ReadonlyArray<string> {
	return search === undefined || search === null
		? []
		: search
				.trim()
				.split(/\s+/u)
				.filter((term) => term.length > 0)
				.slice(0, MAX_TERMS)
				.map((term) => term.slice(0, MAX_TERM_LENGTH));
}

const ACCENT_FAMILIES: Readonly<Record<string, string>> = {
	a: "aàáâãäåāăą",
	c: "cçćĉċč",
	e: "eèéêëēĕėęě",
	i: "iìíîïĩīĭįı",
	n: "nñńņň",
	o: "oòóôõöøōŏő",
	u: "uùúûüũūŭůűų",
	y: "yýÿŷ",
	s: "sśŝşš",
	z: "zźżž",
	g: "gĝğġģ",
	l: "lĺļľłŀ",
	r: "rŕŗř",
	t: "tţťŧ",
	d: "dďđ",
};

const BASE_LETTER: ReadonlyMap<string, string> = new Map(
	Object.entries(ACCENT_FAMILIES).flatMap(([base, family]) =>
		Array.from(family).flatMap(
			(letter): Array<[string, string]> => [
				[letter, base],
				[letter.toUpperCase(), base],
			],
		),
	),
);

export function foldAccents(term: string): string {
	return Array.from(
		deburr(term.toLowerCase()),
		(letter) => BASE_LETTER.get(letter) ?? letter,
	).join("");
}

const LIKE_METACHARACTERS = /[\\%_]/gu;

export function escapeLikePattern(value: string): string {
	return value.replace(LIKE_METACHARACTERS, "\\$&");
}
