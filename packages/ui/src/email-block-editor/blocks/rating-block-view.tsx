import { StarIcon } from "@phosphor-icons/react";
import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { RichTextEditable } from "#/email-block-editor/blocks/rich-text-editable.tsx";
import {
	useEmailEditorLabels,
	useEmailEditorTheme,
} from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorRatingBlock } from "#/email-block-editor/document/types.ts";

/** The scale, mirroring the domain's `EMAIL_RATING_SCALE`. */
const RATING_SCALE = [1, 2, 3, 4, 5] as const;

interface Props extends EmailBlockComponentProps<EmailEditorRatingBlock> {}

/**
 * A one-to-five satisfaction question. In the sent email each star is its own
 * link carrying `?rating=N`, which makes the five steps five separately
 * countable tracked links; on the canvas they are inert.
 */
export function RatingBlockView({ block, onChange }: Props) {
	const theme = useEmailEditorTheme();
	const { blocks } = useEmailEditorLabels();
	return (
		<div className="flex flex-col items-center gap-3 text-center">
			<RichTextEditable
				spans={block.question}
				onChange={(question) => onChange({ ...block, question })}
				ariaLabel={blocks.rating.ariaLabel}
				placeholder={blocks.rating.placeholder}
				className="text-center text-[16px] leading-[1.6]"
				style={{ fontFamily: theme.font, color: theme.color.ink }}
			/>
			<div className="flex items-center gap-2" aria-hidden>
				{RATING_SCALE.map((rating) => (
					<StarIcon
						key={rating}
						size={30}
						weight={block.style === "filled" ? "fill" : "regular"}
						color={theme.color.brand}
					/>
				))}
			</div>
			{block.lowLabel === "" && block.highLabel === "" ? null : (
				<div
					className="flex w-full max-w-[220px] justify-between text-[12px]"
					style={{ color: theme.color.muted, fontFamily: theme.font }}
				>
					<span>{block.lowLabel}</span>
					<span>{block.highLabel}</span>
				</div>
			)}
		</div>
	);
}
