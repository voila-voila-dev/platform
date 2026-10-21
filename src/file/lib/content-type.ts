const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
	png: "image/png",
	jpg: "image/jpeg",
	jpeg: "image/jpeg",
	gif: "image/gif",
	webp: "image/webp",
	svg: "image/svg+xml",
	ico: "image/x-icon",
	pdf: "application/pdf",
	mp4: "video/mp4",
	// `video/webm` also plays in an `<audio>` element, so voice notes stored as webm still play.
	webm: "video/webm",
	mpeg: "audio/mpeg",
	mp3: "audio/mpeg",
	ogg: "audio/ogg",
	m4a: "audio/mp4",
};

export function contentTypeOfKey(key: string): string {
	const extension = key.split(".").pop() ?? "";
	return (
		CONTENT_TYPE_BY_EXTENSION[extension.toLowerCase()] ??
		"application/octet-stream"
	);
}

export function extensionFromContentType(contentType: string): string {
	const subtype = contentType.split("/")[1] ?? "bin";
	return (subtype.split(";")[0] ?? "bin").trim() || "bin";
}

export function normalizeContentType(contentType: string): string {
	return (contentType.split(";")[0] ?? "").trim().toLowerCase();
}
