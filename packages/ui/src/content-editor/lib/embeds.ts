/** A raw YouTube video id, or the id inside a youtube.com / youtu.be URL. */
export function youtubeVideoIdFrom(input: string): string | null {
	const trimmed = input.trim();
	if (/^[\w-]{6,15}$/.test(trimmed)) {
		return trimmed;
	}
	const match = trimmed.match(
		/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/,
	);
	return match?.[1] ?? null;
}

/** A raw X post id, or the id inside an x.com / twitter.com status URL. */
export function xPostIdFrom(input: string): string | null {
	const trimmed = input.trim();
	if (/^\d{6,25}$/.test(trimmed)) {
		return trimmed;
	}
	const match = trimmed.match(/(?:twitter\.com|x\.com)\/[^/]+\/status\/(\d+)/);
	return match?.[1] ?? null;
}
