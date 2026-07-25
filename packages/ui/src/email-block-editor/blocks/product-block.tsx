import { TagIcon } from "@phosphor-icons/react";
import type {
	EmailBlockComponentProps,
	EmailBlockDefinition,
} from "#/email-block-editor/blocks/block-definitions.tsx";
import { BlockTextInput } from "#/email-block-editor/blocks/block-text-input.tsx";
import {
	EmailCardButton,
	EmailCardShell,
} from "#/email-block-editor/blocks/email-card-shell.tsx";
import type { EmailEditorProductBlock } from "#/email-block-editor/document/types.ts";
import { BlockOptionSection } from "#/email-block-editor/sections/block-options/block-option-row.tsx";
import {
	formatPreviewPrice,
	MoneyOption,
} from "#/email-block-editor/sections/block-options/money-option.tsx";
import { ToggleOption } from "#/email-block-editor/sections/block-options/select-option.tsx";
import {
	LinkOption,
	TextAreaOption,
	TextOption,
} from "#/email-block-editor/sections/block-options/text-option.tsx";
import { EMAIL_COLOR } from "#/email-block-editor/theme.ts";

/**
 * A catalogue item on the shared card shell: visual, name, description, price
 * with an optional struck-through base price, and a call to action.
 */
function ProductBlockView({
	block,
	onChange,
}: EmailBlockComponentProps<EmailEditorProductBlock>) {
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

function ProductBlockSettings({
	block,
	onChange,
}: EmailBlockComponentProps<EmailEditorProductBlock>) {
	return (
		<>
			<BlockOptionSection title="Content">
				<TextOption
					label="Name"
					value={block.name}
					onChange={(name) => onChange({ ...block, name })}
				/>
				<TextAreaOption
					label="Description"
					value={block.description}
					onChange={(description) => onChange({ ...block, description })}
				/>
				<MoneyOption
					label="Price"
					value={block.price}
					onChange={(price) => onChange({ ...block, price })}
				/>
				<ToggleOption
					label="Struck-through base price"
					checked={block.compareAtPrice !== null}
					onChange={(enabled) =>
						onChange({
							...block,
							compareAtPrice: enabled ? { ...block.price } : null,
						})
					}
					description="Shows a struck-through price next to the current price."
				/>
				{block.compareAtPrice === null ? null : (
					<MoneyOption
						label="Base price"
						value={block.compareAtPrice}
						onChange={(compareAtPrice) =>
							onChange({ ...block, compareAtPrice })
						}
					/>
				)}
			</BlockOptionSection>
			<BlockOptionSection title="Appearance">
				<TextOption
					label="Image URL"
					value={block.image.src}
					onChange={(src) =>
						onChange({ ...block, image: { ...block.image, src } })
					}
					placeholder="https://"
				/>
				<TextOption
					label="Alt text"
					value={block.image.alt}
					onChange={(alt) =>
						onChange({ ...block, image: { ...block.image, alt } })
					}
				/>
			</BlockOptionSection>
			<BlockOptionSection title="Link">
				<TextOption
					label="Button label"
					value={block.buttonLabel}
					onChange={(buttonLabel) => onChange({ ...block, buttonLabel })}
					placeholder="Order now"
					description="Leave empty for a card without a button."
				/>
				<LinkOption
					value={block.href}
					onChange={(href) => onChange({ ...block, href })}
				/>
			</BlockOptionSection>
		</>
	);
}

export const productBlockDefinition: EmailBlockDefinition<EmailEditorProductBlock> =
	{
		label: "Product",
		icon: TagIcon,
		View: ProductBlockView,
		Settings: ProductBlockSettings,
	};
