import { Option, Schema } from "effect";
import { ContentType } from "#file/value-objects/content-type";

const OCTET_STREAM = ContentType.make("application/octet-stream");

const CONTENT_TYPE_BY_EXTENSION: Record<string, ContentType> = {
	png: ContentType.make("image/png"),
	jpg: ContentType.make("image/jpeg"),
	jpeg: ContentType.make("image/jpeg"),
	gif: ContentType.make("image/gif"),
	webp: ContentType.make("image/webp"),
	svg: ContentType.make("image/svg+xml"),
	ico: ContentType.make("image/x-icon"),
	pdf: ContentType.make("application/pdf"),
	mp4: ContentType.make("video/mp4"),
	// `video/webm` also plays in an `<audio>` element, so voice notes stored as webm still play.
	webm: ContentType.make("video/webm"),
	mpeg: ContentType.make("audio/mpeg"),
	mp3: ContentType.make("audio/mpeg"),
	ogg: ContentType.make("audio/ogg"),
	m4a: ContentType.make("audio/mp4"),
};

const decodeContentType = Schema.decodeUnknownOption(ContentType);

export function contentTypeOfKey(key: string): ContentType {
	const extension = key.split(".").pop() ?? "";
	return CONTENT_TYPE_BY_EXTENSION[extension.toLowerCase()] ?? OCTET_STREAM;
}

export function extensionFromContentType(contentType: ContentType): string {
	return contentType.split("/")[1] ?? "bin";
}

// A header from outside (a browser, an inbound email, the store) as a `ContentType`.
export function normalizeContentType(raw: string): Option.Option<ContentType> {
	return decodeContentType((raw.split(";")[0] ?? "").trim().toLowerCase());
}

export function normalizeContentTypeOrOctetStream(raw: string): ContentType {
	return Option.getOrElse(normalizeContentType(raw), () => OCTET_STREAM);
}
