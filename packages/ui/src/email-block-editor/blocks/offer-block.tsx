import {
	CheckIcon,
	PlusIcon,
	SealPercentIcon,
	XIcon,
} from "@phosphor-icons/react";
import { Button } from "#/components/button.tsx";
import type {
	EmailBlockComponentProps,
	EmailBlockDefinition,
} from "#/email-block-editor/blocks/block-definitions.tsx";
import { BlockTextInput } from "#/email-block-editor/blocks/block-text-input.tsx";
import {
	EmailCardButton,
	EmailCardMeta,
	EmailCardShell,
} from "#/email-block-editor/blocks/email-card-shell.tsx";
import type { EmailEditorOfferBlock } from "#/email-block-editor/document/types.ts";
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
 * A pricing plan on the shared card shell: an eyebrow, a name, a price with an
 * optional period, a feature list and a call to action. `highlighted` draws
 * the recommended plan of a row in the brand colour.
 */
function OfferBlockView({
	block,
	onChange,
}: EmailBlockComponentProps<EmailEditorOfferBlock>) {
	return (
		<EmailCardShell
			image={block.image.src === "" ? undefined : block.image}
			highlighted={block.highlighted}
		>
			<OfferHeader block={block} onChange={onChange} />
			{block.description === "" ? null : (
				<p
					className="text-[15px] leading-[1.5]"
					style={{ color: EMAIL_COLOR.ink }}
				>
					{block.description}
				</p>
			)}
			<OfferFeatureList features={block.features} />
			<EmailCardButton label={block.buttonLabel} />
		</EmailCardShell>
	);
}

/** The plan's identity: its optional surtitle, its name, and the price with
 * its optional recurrence. */
function OfferHeader({
	block,
	onChange,
}: {
	block: EmailEditorOfferBlock;
	onChange: (block: EmailEditorOfferBlock) => void;
}) {
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

/** The ticked included features, mirroring the bulleted list the renderer
 * emits for them. */
function OfferFeatureList({ features }: { features: ReadonlyArray<string> }) {
	if (features.length === 0) {
		return null;
	}
	return (
		<ul className="flex list-none flex-col gap-1 p-0">
			{features.map((feature, index) => (
				<li
					key={index}
					className="flex items-start gap-2 text-[14px] leading-[1.5]"
					style={{ color: EMAIL_COLOR.ink }}
				>
					<CheckIcon
						size={16}
						aria-hidden
						style={{ color: EMAIL_COLOR.brand, marginTop: 3 }}
					/>
					{feature}
				</li>
			))}
		</ul>
	);
}

function OfferFeatureSettings({
	block,
	onChange,
}: {
	block: EmailEditorOfferBlock;
	onChange: (block: EmailEditorOfferBlock) => void;
}) {
	return (
		<div className="flex flex-col gap-2">
			<span className="font-medium text-sm">Included features</span>
			{block.features.map((feature, index) => (
				<div key={index} className="flex items-center gap-2">
					<input
						aria-label={`Included feature ${index + 1}`}
						value={feature}
						onChange={(event) =>
							onChange({
								...block,
								features: block.features.map((current, at) =>
									at === index ? event.target.value : current,
								),
							})
						}
						className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
					/>
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label={`Remove feature ${index + 1}`}
						onClick={() =>
							onChange({
								...block,
								features: block.features.filter((_, at) => at !== index),
							})
						}
					>
						<XIcon aria-hidden />
					</Button>
				</div>
			))}
			<Button
				variant="outline"
				size="sm"
				onClick={() =>
					onChange({ ...block, features: [...block.features, ""] })
				}
			>
				<PlusIcon aria-hidden />
				Add a feature
			</Button>
		</div>
	);
}

function OfferBlockSettings({
	block,
	onChange,
}: EmailBlockComponentProps<EmailEditorOfferBlock>) {
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

export const offerBlockDefinition: EmailBlockDefinition<EmailEditorOfferBlock> =
	{
		label: "Offer",
		icon: SealPercentIcon,
		View: OfferBlockView,
		Settings: OfferBlockSettings,
	};
