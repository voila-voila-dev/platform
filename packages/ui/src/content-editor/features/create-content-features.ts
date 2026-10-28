import { articleFeature } from "#/content-editor/features/article/feature.tsx";
import { blockquoteFeature } from "#/content-editor/features/blockquote/feature.tsx";
import { buttonFeature } from "#/content-editor/features/button/feature.tsx";
import { calloutFeature } from "#/content-editor/features/callout/feature.tsx";
import { codeBlockFeature } from "#/content-editor/features/code-block/feature.tsx";
import { columnsFeature } from "#/content-editor/features/columns/feature.tsx";
import { dividerFeature } from "#/content-editor/features/divider/feature.tsx";
import { fileFeature } from "#/content-editor/features/file/feature.tsx";
import { finePrintFeature } from "#/content-editor/features/fine-print/feature.tsx";
import { headingFeature } from "#/content-editor/features/heading/feature.tsx";
import { highlightFeature } from "#/content-editor/features/highlight/feature.tsx";
import { historyFeature } from "#/content-editor/features/history/feature.tsx";
import { imageFeature } from "#/content-editor/features/image/feature.tsx";
import { linkFeature } from "#/content-editor/features/link/feature.tsx";
import {
	badgeListFeature,
	listFeature,
} from "#/content-editor/features/list/feature.tsx";
import { createOfferFeature } from "#/content-editor/features/offer/feature.tsx";
import { paragraphFeature } from "#/content-editor/features/paragraph/feature.tsx";
import { pasteMergeFeature } from "#/content-editor/features/paste-merge-feature.ts";
import { createProductFeature } from "#/content-editor/features/product/feature.tsx";
import { ratingFeature } from "#/content-editor/features/rating/feature.tsx";
import { slashFeature } from "#/content-editor/features/slash/feature.tsx";
import { statFeature } from "#/content-editor/features/stat/feature.tsx";
import { strictNodesFeature } from "#/content-editor/features/strict-nodes/feature.ts";
import {
	emailTableFeature,
	tableFeature,
} from "#/content-editor/features/table/feature.tsx";
import {
	createTextMarksFeature,
	textMarksFeature,
} from "#/content-editor/features/text-marks/feature.tsx";
import { variableFeature } from "#/content-editor/features/variable/feature.tsx";
import { videoFeature } from "#/content-editor/features/video/feature.tsx";
import { voidNavigationFeature } from "#/content-editor/features/void-navigation/feature.tsx";
import { xPostFeature } from "#/content-editor/features/x-post/feature.tsx";
import { youtubeFeature } from "#/content-editor/features/youtube/feature.tsx";
import {
	type ContentCorrespondenceOptions,
	type ContentEmailOptions,
	type ContentReadersOptions,
	EMAIL_MARKS,
} from "#/content-editor/reader/readers.ts";

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
	marks,
}: ContentReadersOptions = {}) {
	return [
		historyFeature,
		paragraphFeature,
		createTextMarksFeature(marks),
		headingFeature(headings),
		linkFeature,
		listFeature,
		blockquoteFeature,
		dividerFeature,
		calloutFeature,
		codeBlockFeature,
		imageFeature,
		tableFeature,
		...embeds.map((embed) => embedFeatures[embed]),
		slashFeature,
		voidNavigationFeature,
		pasteMergeFeature,
	] as const;
}

/**
 * A mail written to one person, as in Gmail: text, a list, a quote, an
 * inline image, the recipient's name. Anything else that arrives, by paste
 * or by value, is unwrapped to these (`strictNodesFeature`). Same options
 * as `createCorrespondenceReaders`.
 */
export function createCorrespondenceFeatures({
	marks = EMAIL_MARKS,
}: ContentCorrespondenceOptions = {}) {
	return [
		historyFeature,
		paragraphFeature,
		createTextMarksFeature(marks),
		linkFeature,
		listFeature,
		blockquoteFeature,
		imageFeature,
		variableFeature,
		slashFeature,
		voidNavigationFeature,
		pasteMergeFeature,
		strictNodesFeature,
	] as const;
}

/**
 * A campaign email: every block of the email block editor, in the order the
 * toolbar and the slash menu list them. Anything else that arrives is
 * unwrapped to these (`strictNodesFeature`). Pair it with
 * `appearance="email"`. Same options as `createEmailReaders`.
 */
export function createEmailFeatures({
	headings = ["h1", "h2"],
	marks = EMAIL_MARKS,
	currencies = ["EUR"],
}: ContentEmailOptions = {}) {
	return [
		historyFeature,
		paragraphFeature,
		createTextMarksFeature(marks),
		headingFeature(headings),
		linkFeature,
		listFeature,
		badgeListFeature,
		highlightFeature,
		finePrintFeature,
		buttonFeature,
		statFeature,
		imageFeature,
		dividerFeature,
		articleFeature,
		createProductFeature({ currencies }),
		createOfferFeature({ currencies }),
		ratingFeature,
		emailTableFeature,
		columnsFeature,
		variableFeature,
		slashFeature,
		voidNavigationFeature,
		pasteMergeFeature,
		strictNodesFeature,
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
