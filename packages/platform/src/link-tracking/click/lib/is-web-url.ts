// Destinations are free text typed by hand; a `Location:` header is not where
// an unexpected scheme should first be discovered.
export function isWebUrl(destinationUrl: string): boolean {
	try {
		const { protocol } = new URL(destinationUrl);
		return protocol === "http:" || protocol === "https:";
	} catch {
		return false;
	}
}
