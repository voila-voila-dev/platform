import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { BlockTextInput } from "#/email-block-editor/blocks/block-text-input.tsx";
import { EmailCardButton } from "#/email-block-editor/blocks/email-card-button.tsx";
import { EmailCardShell } from "#/email-block-editor/blocks/email-card-shell.tsx";
import type { EmailEditorProductBlock } from "#/email-block-editor/document/types.ts";
import { formatPreviewPrice } from "#/email-block-editor/lib/money.ts";
import { EMAIL_COLOR } from "#/email-block-editor/theme.ts";

interface Props extends EmailBlockComponentProps<EmailEditorProductBlock> {}

/**
 * A catalogue item on the shared card shell: visual, name, description, price
 * with an optional struck-through base price, and a call to action.
 */
export function ProductBlockView({ block, onChange }: Props) {
	return (
		<EmailCardShell image={block.image}>
			<BlockTextInput
				ariaLabel="Product name"
				value={block.name}
				placeholder="Product name"
				onChange={(name) => onChange({ ...block, name })}
				className="font-bold text-[17px] leading-[1.3]"
				style={{ color: EMAIL_COLOR.brand }}
			/>
			<textarea
				aria-label="Product description"
				value={block.description}
				placeholder="The product description."
				rows={2}
				onChange={(event) =>
					onChange({ ...block, description: event.target.value })
				}
				className="w-full resize-none border-none bg-transparent p-0 text-[15px] leading-[1.5] outline-none [field-sizing:content] placeholder:opacity-40"
				style={{ color: EMAIL_COLOR.ink }}
			/>
			<div className="flex items-baseline gap-2">
				<span
					className="font-bold text-[18px]"
					style={{ color: EMAIL_COLOR.ink }}
				>
					{formatPreviewPrice(block.price)}
				</span>
				{block.compareAtPrice === null ? null : (
					<span
						className="text-[14px] line-through"
						style={{ color: EMAIL_COLOR.muted }}
					>
						{formatPreviewPrice(block.compareAtPrice)}
					</span>
				)}
			</div>
			<EmailCardButton label={block.buttonLabel} />
		</EmailCardShell>
	);
}
