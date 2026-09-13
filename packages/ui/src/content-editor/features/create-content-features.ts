import { blockquoteFeature } from "#/content-editor/features/blockquote/feature.tsx";
import { calloutFeature } from "#/content-editor/features/callout/feature.tsx";
import { dividerFeature } from "#/content-editor/features/divider/feature.tsx";
import { fileFeature } from "#/content-editor/features/file/feature.tsx";
import { headingFeature } from "#/content-editor/features/heading/feature.tsx";
import { historyFeature } from "#/content-editor/features/history/feature.tsx";
import { imageFeature } from "#/content-editor/features/image/feature.tsx";
import { linkFeature } from "#/content-editor/features/link/feature.tsx";
import { listFeature } from "#/content-editor/features/list/feature.tsx";
import { paragraphFeature } from "#/content-editor/features/paragraph/feature.tsx";
import { pasteMergeFeature } from "#/content-editor/features/paste-merge-feature.ts";
import { slashFeature } from "#/content-editor/features/slash/feature.tsx";
import { tableFeature } from "#/content-editor/features/table/feature.tsx";
import { textMarksFeature } from "#/content-editor/features/text-marks/feature.tsx";
import { videoFeature } from "#/content-editor/features/video/feature.tsx";
import { xPostFeature } from "#/content-editor/features/x-post/feature.tsx";
import { youtubeFeature } from "#/content-editor/features/youtube/feature.tsx";
import type { ContentReadersOptions } from "#/content-editor/reader/readers.ts";

const embedFeatures = {
	youtube: youtubeFeature,
	"x-post": xPostFeature,
	video: videoFeature,
	file: fileFeature,
} as const;

/**
 * The built-in features, in the order the toolbar and the slash menu list
 * them. Same options as `createContentReaders`, so a reader built with the
 * same options renders exactly what this edits.
 */
export function createContentFeatures({
	headings = ["h2", "h3"],
	embeds = ["youtube", "x-post", "video", "file"],
}: ContentReadersOptions = {}) {
	return [
		historyFeature,
		paragraphFeature,
		textMarksFeature,
		headingFeature(headings),
		linkFeature,
		listFeature,
		blockquoteFeature,
		dividerFeature,
		calloutFeature,
		imageFeature,
		tableFeature,
		...embeds.map((embed) => embedFeatures[embed]),
		slashFeature,
		pasteMergeFeature,
	] as const;
}

/** Marks and links only: a short field, a caption, a FAQ answer. */
export function createInlineContentFeatures() {
	return [
		paragraphFeature,
		textMarksFeature,
		linkFeature,
		pasteMergeFeature,
	] as const;
}
