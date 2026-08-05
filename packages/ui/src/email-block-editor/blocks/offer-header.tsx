import { BlockTextInput } from "#/email-block-editor/blocks/block-text-input.tsx";
import { EmailCardMeta } from "#/email-block-editor/blocks/email-card-meta.tsx";
import {
	useEmailEditorLabels,
	useEmailEditorTheme,
} from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorOfferBlock } from "#/email-block-editor/document/types.ts";
import { formatPreviewPrice } from "#/email-block-editor/lib/money.ts";

interface Props<Currency extends string> {
	block: EmailEditorOfferBlock<Currency>;
	onChange: (block: EmailEditorOfferBlock<Currency>) => void;
}

/** The plan's identity: its optional surtitle, its name, and the price with
 * its optional recurrence. */
export function OfferHeader<Currency extends string>({
	block,
	onChange,
}: Props<Currency>) {
	const theme = useEmailEditorTheme();
	const { blocks } = useEmailEditorLabels();
	return (
		<>
			{block.eyebrow === "" ? null : (
				<span
					className="font-semibold text-[11px] uppercase tracking-[0.06em]"
					style={{ color: theme.color.brand }}
				>
					{block.eyebrow}
				</span>
			)}
			<BlockTextInput
				ariaLabel={blocks.offer.nameAriaLabel}
				value={block.name}
				placeholder={blocks.offer.namePlaceholder}
				onChange={(name) => onChange({ ...block, name })}
				className="font-bold text-[17px] leading-[1.3]"
				style={{ color: theme.color.brand }}
			/>
			<div className="flex items-baseline gap-1.5">
				<span
					className="font-bold text-[26px] leading-[1.1]"
					style={{ color: theme.color.ink }}
				>
					{formatPreviewPrice(block.price, theme.locale)}
				</span>
				{block.period === "" ? null : (
					<EmailCardMeta>{block.period}</EmailCardMeta>
				)}
			</div>
		</>
	);
}
