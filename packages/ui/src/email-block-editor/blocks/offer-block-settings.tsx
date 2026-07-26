import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { OfferFeatureSettings } from "#/email-block-editor/blocks/offer-feature-settings.tsx";
import { BlockOptionSection } from "#/email-block-editor/components/block-options/block-option-section.tsx";
import { LinkOption } from "#/email-block-editor/components/block-options/link-option.tsx";
import { MoneyOption } from "#/email-block-editor/components/block-options/money-option.tsx";
import { TextAreaOption } from "#/email-block-editor/components/block-options/text-area-option.tsx";
import { TextOption } from "#/email-block-editor/components/block-options/text-option.tsx";
import { ToggleOption } from "#/email-block-editor/components/block-options/toggle-option.tsx";
import type { EmailEditorOfferBlock } from "#/email-block-editor/document/types.ts";

interface Props extends EmailBlockComponentProps<EmailEditorOfferBlock> {}

/** The settings panel for an offer block. */
export function OfferBlockSettings({ block, onChange }: Props) {
	return (
		<>
			<BlockOptionSection title="Content">
				<TextOption
					label="Eyebrow"
					value={block.eyebrow}
					onChange={(eyebrow) => onChange({ ...block, eyebrow })}
					placeholder="Most popular"
				/>
				<TextOption
					label="Name"
					value={block.name}
					onChange={(name) => onChange({ ...block, name })}
				/>
				<MoneyOption
					label="Price"
					value={block.price}
					onChange={(price) => onChange({ ...block, price })}
				/>
				<TextOption
					label="Billing period"
					value={block.period}
					onChange={(period) => onChange({ ...block, period })}
					placeholder="per month"
					description="Leave empty for a one-off price."
				/>
				<TextAreaOption
					label="Description"
					value={block.description}
					onChange={(description) => onChange({ ...block, description })}
				/>
				<OfferFeatureSettings block={block} onChange={onChange} />
			</BlockOptionSection>
			<BlockOptionSection title="Appearance">
				<ToggleOption
					label="Highlight"
					checked={block.highlighted}
					onChange={(highlighted) => onChange({ ...block, highlighted })}
					description="Frames the card in the brand color. Outlook (Word engine) renders square corners."
				/>
				<TextOption
					label="Image URL"
					value={block.image.src}
					onChange={(src) =>
						onChange({ ...block, image: { ...block.image, src } })
					}
					placeholder="https://"
					description="Leave empty for an offer without a visual."
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
					placeholder="Choose this offer"
					description="Leave empty for a card without a button."
				/>
				<LinkOption
					value={block.buttonHref}
					onChange={(buttonHref) => onChange({ ...block, buttonHref })}
				/>
			</BlockOptionSection>
		</>
	);
}
