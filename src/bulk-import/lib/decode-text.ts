// Spreadsheets saved as « CSV » by Excel are Windows-1252 rather than UTF-8:
// any byte sequence UTF-8 refuses reads as that.
export function decodeText(bytes: Uint8Array): string {
	try {
		return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
	} catch {
		return new TextDecoder("windows-1252").decode(bytes);
	}
}
