import { BlockTextInput } from "#/email-block-editor/blocks/block-text-input.tsx";
import { EmailCardMeta } from "#/email-block-editor/blocks/email-card-meta.tsx";
import type { EmailEditorOfferBlock } from "#/email-block-editor/document/types.ts";
import { formatPreviewPrice } from "#/email-block-editor/lib/money.ts";
import { EMAIL_COLOR } from "#/email-block-editor/theme.ts";

interface Props {
	block: EmailEditorOfferBlock;
	onChange: (block: EmailEditorOfferBlock) => void;
}

/** The plan's identity: its optional surtitle, its name, and the price with
 * its optional recurrence. */
export function OfferHeader({ block, onChange }: Props) {
	return (
		<>
			{block.eyebrow === "" ? null : (
				<span
					className="font-semibold text-[11px] uppercase tracking-[0.06em]"
					style={{ color: EMAIL_COLOR.brand }}
				>
					{block.eyebrow}
				</span>
			)}
			<BlockTextInput
				ariaLabel="Offer name"
				value={block.name}
				placeholder="Offer name"
				onChange={(name) => onChange({ ...block, name })}
				className="font-bold text-[17px] leading-[1.3]"
				style={{ color: EMAIL_COLOR.brand }}
			/>
			<div className="flex items-baseline gap-1.5">
				<span
					className="font-bold text-[26px] leading-[1.1]"
					style={{ color: EMAIL_COLOR.ink }}
				>
					{formatPreviewPrice(block.price)}
				</span>
				{block.period === "" ? null : (
					<EmailCardMeta>{block.period}</EmailCardMeta>
				)}
			</div>
		</>
	);
}
