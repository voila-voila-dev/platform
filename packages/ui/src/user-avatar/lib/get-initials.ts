/** Derive up-to-two-letter initials from a full name ("Camille Dubois" → "CD"). */
export function getInitials(name: string): string {
	const words = name.trim().split(/\s+/).filter(Boolean);
	const firstLetter = words[0]?.[0] ?? "";
	const lastLetter = words.length > 1 ? (words.at(-1)?.[0] ?? "") : "";
	return `${firstLetter}${lastLetter}`.toUpperCase();
}
