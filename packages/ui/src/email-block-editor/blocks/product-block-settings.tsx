import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { BlockOptionSection } from "#/email-block-editor/components/block-options/block-option-section.tsx";
import { LinkOption } from "#/email-block-editor/components/block-options/link-option.tsx";
import { MoneyOption } from "#/email-block-editor/components/block-options/money-option.tsx";
import { TextAreaOption } from "#/email-block-editor/components/block-options/text-area-option.tsx";
import { TextOption } from "#/email-block-editor/components/block-options/text-option.tsx";
import { ToggleOption } from "#/email-block-editor/components/block-options/toggle-option.tsx";
import type { EmailEditorProductBlock } from "#/email-block-editor/document/types.ts";

interface Props extends EmailBlockComponentProps<EmailEditorProductBlock> {}

/** The settings panel for a product block. */
export function ProductBlockSettings({ block, onChange }: Props) {
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
