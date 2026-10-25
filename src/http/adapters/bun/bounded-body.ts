export interface BoundedBody {
	readonly bytes: Uint8Array;
	readonly truncated: boolean;
}

// Reading stops at the bound, so an endless answer is never buffered whole.
export async function boundedBody(
	response: Response,
	maxBytes: number,
): Promise<BoundedBody> {
	if (response.body === null)
		return { bytes: new Uint8Array(0), truncated: false };
	const reader = response.body.getReader();
	const chunks: Array<Uint8Array> = [];
	let total = 0;
	let truncated = false;
	while (!truncated) {
		const { done, value } = await reader.read();
		if (done) break;
		truncated = value.byteLength > maxBytes - total;
		const kept = value.subarray(0, maxBytes - total);
		chunks.push(kept);
		total += kept.byteLength;
	}
	await reader.cancel().catch(() => undefined);
	const bytes = new Uint8Array(total);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return { bytes, truncated };
}
