import { StarIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { useContentEditorLabels } from "#/content-editor/context/content-editor-context.tsx";
import { useContentEditorTheme } from "#/content-editor/context/theme-context.ts";
import { isContentText } from "#/content-editor/features/content-value.ts";
import {
	type ContentRatingNode,
	RATING_SCALE,
} from "#/content-editor/features/rating/reader.tsx";

function hasText(node: ContentRatingNode): boolean {
	return node.children.some((child) =>
		isContentText(child) ? child.text !== "" : true,
	);
}

/**
 * The email block editor's rating: the question typed in place, the five
 * stars and the scale's two ends under it. The stars are inert here; in
 * the email each is its own link.
 */
export function RatingView({
	node,
	children,
}: {
	readonly node: ContentRatingNode;
	readonly children?: ReactNode;
}) {
	const theme = useContentEditorTheme();
	const { fields } = useContentEditorLabels();
	return (
		<div className="flex flex-col items-center gap-3 text-center">
			<div
				className="relative w-full text-center text-[16px] leading-[1.6]"
				style={{ fontFamily: theme.font, color: theme.color.ink }}
			>
				{hasText(node) ? null : (
					<span
						contentEditable={false}
						className="pointer-events-none absolute inset-x-0 top-0 select-none opacity-40"
					>
						{fields.ratingQuestionPlaceholder}
					</span>
				)}
				{children}
			</div>
			<div
				contentEditable={false}
				className="flex select-none items-center gap-2"
				aria-hidden
			>
				{RATING_SCALE.map((rating) => (
					<StarIcon
						key={rating}
						size={30}
						weight={node.style === "filled" ? "fill" : "regular"}
						color={theme.color.brand}
					/>
				))}
			</div>
			{node.lowLabel === "" && node.highLabel === "" ? null : (
				<div
					contentEditable={false}
					className="flex w-full max-w-[220px] select-none justify-between text-[12px]"
					style={{ color: theme.color.muted, fontFamily: theme.font }}
				>
					<span>{node.lowLabel}</span>
					<span>{node.highLabel}</span>
				</div>
			)}
		</div>
	);
}
