import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { BlockOptionSection } from "#/email-block-editor/components/block-options/block-option-section.tsx";
import { LinkOption } from "#/email-block-editor/components/block-options/link-option.tsx";
import { MoneyOption } from "#/email-block-editor/components/block-options/money-option.tsx";
import { TextAreaOption } from "#/email-block-editor/components/block-options/text-area-option.tsx";
import { TextOption } from "#/email-block-editor/components/block-options/text-option.tsx";
import { ToggleOption } from "#/email-block-editor/components/block-options/toggle-option.tsx";
import { useEmailEditorLabels } from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorProductBlock } from "#/email-block-editor/document/types.ts";

interface Props extends EmailBlockComponentProps<EmailEditorProductBlock> {}

/** The settings panel for a product block. */
export function ProductBlockSettings({ block, onChange }: Props) {
	const { chrome, fields, blocks } = useEmailEditorLabels();
	return (
		<>
			<BlockOptionSection title={chrome.sectionContent}>
				<TextOption
					label={fields.name}
					value={block.name}
					onChange={(name) => onChange({ ...block, name })}
				/>
				<TextAreaOption
					label={fields.description}
					value={block.description}
					onChange={(description) => onChange({ ...block, description })}
				/>
				<MoneyOption
					label={fields.price}
					value={block.price}
					onChange={(price) => onChange({ ...block, price })}
				/>
				<ToggleOption
					label={blocks.product.compareAtPriceToggle}
					checked={block.compareAtPrice !== null}
					onChange={(enabled) =>
						onChange({
							...block,
							compareAtPrice: enabled ? { ...block.price } : null,
						})
					}
					description={blocks.product.compareAtPriceDescription}
				/>
				{block.compareAtPrice === null ? null : (
					<MoneyOption
						label={blocks.product.compareAtPrice}
						value={block.compareAtPrice}
						onChange={(compareAtPrice) =>
							onChange({ ...block, compareAtPrice })
						}
					/>
				)}
			</BlockOptionSection>
			<BlockOptionSection title={chrome.sectionAppearance}>
				<TextOption
					label={fields.imageUrl}
					value={block.image.src}
					onChange={(src) =>
						onChange({ ...block, image: { ...block.image, src } })
					}
					placeholder={fields.urlPlaceholder}
				/>
				<TextOption
					label={fields.altText}
					value={block.image.alt}
					onChange={(alt) =>
						onChange({ ...block, image: { ...block.image, alt } })
					}
				/>
			</BlockOptionSection>
			<BlockOptionSection title={chrome.sectionLink}>
				<TextOption
					label={fields.buttonLabel}
					value={block.buttonLabel}
					onChange={(buttonLabel) => onChange({ ...block, buttonLabel })}
					placeholder={blocks.product.buttonLabelPlaceholder}
					description={blocks.product.buttonLabelDescription}
				/>
				<LinkOption
					value={block.href}
					onChange={(href) => onChange({ ...block, href })}
				/>
			</BlockOptionSection>
		</>
	);
}
