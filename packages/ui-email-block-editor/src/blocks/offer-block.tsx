import {
	CheckIcon,
	PlusIcon,
	SealPercentIcon,
	XIcon,
} from "@phosphor-icons/react";
import { Button } from "@voila.dev/ui/components/button";
import type {
	EmailBlockComponentProps,
	EmailBlockDefinition,
} from "#/blocks/block-definitions.tsx";
import { BlockTextInput } from "#/blocks/block-text-input.tsx";
import {
	EmailCardButton,
	EmailCardMeta,
	EmailCardShell,
} from "#/blocks/email-card-shell.tsx";
import type { EmailEditorOfferBlock } from "#/document/types.ts";
import { BlockOptionSection } from "#/sections/block-options/block-option-row.tsx";
import {
	formatPreviewPrice,
	MoneyOption,
} from "#/sections/block-options/money-option.tsx";
import { ToggleOption } from "#/sections/block-options/select-option.tsx";
import {
	LinkOption,
	TextAreaOption,
	TextOption,
} from "#/sections/block-options/text-option.tsx";
import { EMAIL_COLOR } from "#/theme.ts";

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
				ariaLabel="Nom de l'offre"
				value={block.name}
				placeholder="Nom de l'offre"
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

/** The ticked « points inclus », mirroring the bulleted list the renderer
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
			<span className="font-medium text-sm">Points inclus</span>
			{block.features.map((feature, index) => (
				<div key={index} className="flex items-center gap-2">
					<input
						aria-label={`Point inclus ${index + 1}`}
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
						aria-label={`Supprimer le point ${index + 1}`}
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
				Ajouter un point
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
			<BlockOptionSection title="Contenu">
				<TextOption
					label="Surtitre"
					value={block.eyebrow}
					onChange={(eyebrow) => onChange({ ...block, eyebrow })}
					placeholder="Le plus choisi"
				/>
				<TextOption
					label="Nom"
					value={block.name}
					onChange={(name) => onChange({ ...block, name })}
				/>
				<MoneyOption
					label="Prix"
					value={block.price}
					onChange={(price) => onChange({ ...block, price })}
				/>
				<TextOption
					label="Périodicité"
					value={block.period}
					onChange={(period) => onChange({ ...block, period })}
					placeholder="par mois"
					description="Laissez vide pour un tarif unique."
				/>
				<TextAreaOption
					label="Description"
					value={block.description}
					onChange={(description) => onChange({ ...block, description })}
				/>
				<OfferFeatureSettings block={block} onChange={onChange} />
			</BlockOptionSection>
			<BlockOptionSection title="Apparence">
				<ToggleOption
					label="Mettre en avant"
					checked={block.highlighted}
					onChange={(highlighted) => onChange({ ...block, highlighted })}
					description="Encadre la carte dans la couleur de marque. Outlook (moteur Word) affiche des angles droits."
				/>
				<TextOption
					label="Adresse de l'image"
					value={block.image.src}
					onChange={(src) =>
						onChange({ ...block, image: { ...block.image, src } })
					}
					placeholder="https://"
					description="Laissez vide pour une offre sans visuel."
				/>
				<TextOption
					label="Texte alternatif"
					value={block.image.alt}
					onChange={(alt) =>
						onChange({ ...block, image: { ...block.image, alt } })
					}
				/>
			</BlockOptionSection>
			<BlockOptionSection title="Lien">
				<TextOption
					label="Libellé du bouton"
					value={block.buttonLabel}
					onChange={(buttonLabel) => onChange({ ...block, buttonLabel })}
					placeholder="Choisir cette offre"
					description="Laissez vide pour une carte sans bouton."
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
		label: "Offre",
		icon: SealPercentIcon,
		View: OfferBlockView,
		Settings: OfferBlockSettings,
	};
