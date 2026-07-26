import { StarIcon } from "@phosphor-icons/react";
import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { RichTextEditable } from "#/email-block-editor/blocks/rich-text-editable.tsx";
import type { EmailEditorRatingBlock } from "#/email-block-editor/document/types.ts";
import { EMAIL_COLOR, EMAIL_FONT } from "#/email-block-editor/theme.ts";

/** The scale, mirroring the domain's `EMAIL_RATING_SCALE`. */
const RATING_SCALE = [1, 2, 3, 4, 5] as const;

interface Props extends EmailBlockComponentProps<EmailEditorRatingBlock> {}

/**
 * A one-to-five satisfaction question. In the sent email each star is its own
 * link carrying `?rating=N`, which makes the five steps five separately
 * countable tracked links; on the canvas they are inert.
 */
export function RatingBlockView({ block, onChange }: Props) {
	return (
		<div className="flex flex-col items-center gap-3 text-center">
			<RichTextEditable
				spans={block.question}
				onChange={(question) => onChange({ ...block, question })}
				ariaLabel="Question"
				placeholder="How did your last project go?"
				className="text-center text-[16px] leading-[1.6]"
				style={{ fontFamily: EMAIL_FONT, color: EMAIL_COLOR.ink }}
			/>
			<div className="flex items-center gap-2" aria-hidden>
				{RATING_SCALE.map((rating) => (
					<StarIcon
						key={rating}
						size={30}
						weight={block.style === "filled" ? "fill" : "regular"}
						color={EMAIL_COLOR.brand}
					/>
				))}
			</div>
			{block.lowLabel === "" && block.highLabel === "" ? null : (
				<div
					className="flex w-full max-w-[220px] justify-between text-[12px]"
					style={{ color: EMAIL_COLOR.muted, fontFamily: EMAIL_FONT }}
				>
					<span>{block.lowLabel}</span>
					<span>{block.highLabel}</span>
				</div>
			)}
		</div>
	);
}
