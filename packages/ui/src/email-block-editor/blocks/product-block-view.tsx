import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { BlockTextInput } from "#/email-block-editor/blocks/block-text-input.tsx";
import { EmailCardButton } from "#/email-block-editor/blocks/email-card-button.tsx";
import { EmailCardShell } from "#/email-block-editor/blocks/email-card-shell.tsx";
import {
	useEmailEditorLabels,
	useEmailEditorTheme,
} from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorProductBlock } from "#/email-block-editor/document/types.ts";
import { formatPreviewPrice } from "#/email-block-editor/lib/money.ts";

interface Props extends EmailBlockComponentProps<EmailEditorProductBlock> {}

/**
 * A catalogue item on the shared card shell: visual, name, description, price
 * with an optional struck-through base price, and a call to action.
 */
export function ProductBlockView({ block, onChange }: Props) {
	const theme = useEmailEditorTheme();
	const { blocks } = useEmailEditorLabels();
	return (
		<EmailCardShell image={block.image}>
			<BlockTextInput
				ariaLabel={blocks.product.nameAriaLabel}
				value={block.name}
				placeholder={blocks.product.namePlaceholder}
				onChange={(name) => onChange({ ...block, name })}
				className="font-bold text-[17px] leading-[1.3]"
				style={{ color: theme.color.brand }}
			/>
			<textarea
				aria-label={blocks.product.descriptionAriaLabel}
				value={block.description}
				placeholder={blocks.product.descriptionPlaceholder}
				rows={2}
				onChange={(event) =>
					onChange({ ...block, description: event.target.value })
				}
				className="w-full resize-none border-none bg-transparent p-0 text-[15px] leading-[1.5] outline-none [field-sizing:content] placeholder:opacity-40"
				style={{ color: theme.color.ink }}
			/>
			<div className="flex items-baseline gap-2">
				<span
					className="font-bold text-[18px]"
					style={{ color: theme.color.ink }}
				>
					{formatPreviewPrice(block.price, theme.locale)}
				</span>
				{block.compareAtPrice === null ? null : (
					<span
						className="text-[14px] line-through"
						style={{ color: theme.color.muted }}
					>
						{formatPreviewPrice(block.compareAtPrice, theme.locale)}
					</span>
				)}
			</div>
			<EmailCardButton label={block.buttonLabel} />
		</EmailCardShell>
	);
}
