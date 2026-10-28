// `btoa`/`atob` rather than `Buffer`: they exist in Bun, Node and Workers alike.

function binaryFromBytes(bytes: ArrayBuffer | Uint8Array): string {
	let binary = "";
	for (const byte of bytes instanceof Uint8Array
		? bytes
		: new Uint8Array(bytes)) {
		binary += String.fromCharCode(byte);
	}
	return binary;
}

export function base64FromBytes(bytes: ArrayBuffer | Uint8Array): string {
	return btoa(binaryFromBytes(bytes));
}

// A fresh `ArrayBuffer`-backed view, so it goes straight into Web Crypto.
export function bytesFromBase64(text: string): Uint8Array<ArrayBuffer> | null {
	try {
		return Uint8Array.from(atob(text), (character) => character.charCodeAt(0));
	} catch {
		return null;
	}
}

export function base64UrlFromBytes(bytes: ArrayBuffer | Uint8Array): string {
	return base64FromBytes(bytes)
		.replaceAll("+", "-")
		.replaceAll("/", "_")
		.replace(/=+$/u, "");
}

export function bytesFromBase64Url(
	text: string,
): Uint8Array<ArrayBuffer> | null {
	// `atob` would accept `+`, `/` and padding; refusing them keeps one spelling
	// per value, so a token cannot be re-encoded into a second valid form.
	if (!/^[A-Za-z0-9_-]*$/u.test(text)) return null;
	return bytesFromBase64(text.replaceAll("-", "+").replaceAll("_", "/"));
}
