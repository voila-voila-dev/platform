const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8", { fatal: true });

// Typed over a plain `ArrayBuffer`, which is what Web Crypto's `BufferSource`
// accepts; `TextEncoder` alone returns the wider `ArrayBufferLike`.
export function utf8Bytes(value: string): Uint8Array<ArrayBuffer> {
	return new Uint8Array(encoder.encode(value));
}

// Throws on an invalid sequence rather than inventing U+FFFD.
export function textFromUtf8(bytes: Uint8Array): string {
	return decoder.decode(bytes);
}
