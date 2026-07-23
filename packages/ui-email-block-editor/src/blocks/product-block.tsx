import { TagIcon } from "@phosphor-icons/react";
import type {
	EmailBlockComponentProps,
	EmailBlockDefinition,
} from "#/blocks/block-definitions.tsx";
import { BlockTextInput } from "#/blocks/block-text-input.tsx";
import { EmailCardButton, EmailCardShell } from "#/blocks/email-card-shell.tsx";
import type { EmailEditorProductBlock } from "#/document/types.ts";
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
 * A catalogue item on the shared card shell: visual, name, description, price
 * with an optional struck-through « tarif de base », and a call to action.
 */
function ProductBlockView({
	block,
	onChange,
}: EmailBlockComponentProps<EmailEditorProductBlock>) {
	return (
		<EmailCardShell image={block.image}>
			<BlockTextInput
				ariaLabel="Nom du produit"
				value={block.name}
				placeholder="Nom du produit"
				onChange={(name) => onChange({ ...block, name })}
				className="font-bold text-[17px] leading-[1.3]"
				style={{ color: EMAIL_COLOR.brand }}
			/>
			<textarea
				aria-label="Description du produit"
				value={block.description}
				placeholder="La description du produit."
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
			<BlockOptionSection title="Contenu">
				<TextOption
					label="Nom"
					value={block.name}
					onChange={(name) => onChange({ ...block, name })}
				/>
				<TextAreaOption
					label="Description"
					value={block.description}
					onChange={(description) => onChange({ ...block, description })}
				/>
				<MoneyOption
					label="Prix"
					value={block.price}
					onChange={(price) => onChange({ ...block, price })}
				/>
				<ToggleOption
					label="Tarif de base barré"
					checked={block.compareAtPrice !== null}
					onChange={(enabled) =>
						onChange({
							...block,
							compareAtPrice: enabled ? { ...block.price } : null,
						})
					}
					description="Affiche un prix barré à côté du prix courant."
				/>
				{block.compareAtPrice === null ? null : (
					<MoneyOption
						label="Tarif de base"
						value={block.compareAtPrice}
						onChange={(compareAtPrice) =>
							onChange({ ...block, compareAtPrice })
						}
					/>
				)}
			</BlockOptionSection>
			<BlockOptionSection title="Apparence">
				<TextOption
					label="Adresse de l'image"
					value={block.image.src}
					onChange={(src) =>
						onChange({ ...block, image: { ...block.image, src } })
					}
					placeholder="https://"
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
					placeholder="Commander"
					description="Laissez vide pour une carte sans bouton."
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
		label: "Produit",
		icon: TagIcon,
		View: ProductBlockView,
		Settings: ProductBlockSettings,
	};
