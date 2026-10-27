export function hexFromBytes(bytes: ArrayBuffer | Uint8Array): string {
	return Array.from(
		bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes),
		(byte) => byte.toString(16).padStart(2, "0"),
	).join("");
}
