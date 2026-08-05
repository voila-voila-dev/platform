import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { OfferFeatureSettings } from "#/email-block-editor/blocks/offer-feature-settings.tsx";
import { BlockOptionSection } from "#/email-block-editor/components/block-options/block-option-section.tsx";
import { LinkOption } from "#/email-block-editor/components/block-options/link-option.tsx";
import { MoneyOption } from "#/email-block-editor/components/block-options/money-option.tsx";
import { TextAreaOption } from "#/email-block-editor/components/block-options/text-area-option.tsx";
import { TextOption } from "#/email-block-editor/components/block-options/text-option.tsx";
import { ToggleOption } from "#/email-block-editor/components/block-options/toggle-option.tsx";
import { useEmailEditorLabels } from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorOfferBlock } from "#/email-block-editor/document/types.ts";

interface Props<Currency extends string>
	extends EmailBlockComponentProps<EmailEditorOfferBlock<Currency>> {}

/** The settings panel for an offer block. */
export function OfferBlockSettings<Currency extends string>({
	block,
	onChange,
}: Props<Currency>) {
	const { chrome, fields, blocks } = useEmailEditorLabels();
	return (
		<>
			<BlockOptionSection title={chrome.sectionContent}>
				<TextOption
					label={blocks.offer.eyebrow}
					value={block.eyebrow}
					onChange={(eyebrow) => onChange({ ...block, eyebrow })}
					placeholder={blocks.offer.eyebrowPlaceholder}
				/>
				<TextOption
					label={fields.name}
					value={block.name}
					onChange={(name) => onChange({ ...block, name })}
				/>
				<MoneyOption
					label={fields.price}
					value={block.price}
					onChange={(price) => onChange({ ...block, price })}
				/>
				<TextOption
					label={blocks.offer.period}
					value={block.period}
					onChange={(period) => onChange({ ...block, period })}
					placeholder={blocks.offer.periodPlaceholder}
					description={blocks.offer.periodDescription}
				/>
				<TextAreaOption
					label={fields.description}
					value={block.description}
					onChange={(description) => onChange({ ...block, description })}
				/>
				<OfferFeatureSettings block={block} onChange={onChange} />
			</BlockOptionSection>
			<BlockOptionSection title={chrome.sectionAppearance}>
				<ToggleOption
					label={blocks.offer.highlighted}
					checked={block.highlighted}
					onChange={(highlighted) => onChange({ ...block, highlighted })}
					description={blocks.offer.highlightedDescription}
				/>
				<TextOption
					label={fields.imageUrl}
					value={block.image.src}
					onChange={(src) =>
						onChange({ ...block, image: { ...block.image, src } })
					}
					placeholder={fields.urlPlaceholder}
					description={blocks.offer.imageDescription}
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
					placeholder={blocks.offer.buttonLabelPlaceholder}
					description={blocks.offer.buttonLabelDescription}
				/>
				<LinkOption
					value={block.buttonHref}
					onChange={(buttonHref) => onChange({ ...block, buttonHref })}
				/>
			</BlockOptionSection>
		</>
	);
}
