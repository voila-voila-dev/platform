import { CursorClickIcon } from "@phosphor-icons/react";
import type {
	EmailBlockComponentProps,
	EmailBlockDefinition,
} from "#/blocks/block-definitions.tsx";
import type {
	EmailEditorAlignment,
	EmailEditorButtonBlock,
	EmailEditorButtonVariant,
} from "#/document/types.ts";
import { AlignmentOption } from "#/sections/block-options/alignment-option.tsx";
import { BlockOptionSection } from "#/sections/block-options/block-option-row.tsx";
import { SelectOption } from "#/sections/block-options/select-option.tsx";
import {
	LinkOption,
	TextOption,
} from "#/sections/block-options/text-option.tsx";
import { EMAIL_COLOR, EMAIL_FONT } from "#/theme.ts";

const VARIANT_OPTIONS: ReadonlyArray<{
	readonly value: EmailEditorButtonVariant;
	readonly label: string;
}> = [
	{ value: "primary", label: "Plein (couleur de marque)" },
	{ value: "secondary", label: "Contour" },
];

/** Flexbox equivalents of the email's `align` attribute. */
const JUSTIFY: { readonly [A in EmailEditorAlignment]: string } = {
	left: "flex-start",
	center: "center",
	right: "flex-end",
};

/**
 * The call-to-action button. The label is edited in place; the target URL, the
 * alignment and the variant live in the settings sidebar (no inline chip — the
 * button carries one link for the whole block, unlike a paragraph's
 * per-selection links). Mirrors the domain `emailButton` component.
 */
function ButtonBlockView({
	block,
	onChange,
}: EmailBlockComponentProps<EmailEditorButtonBlock>) {
	const filled = block.variant === "primary";
	return (
		<div className="flex" style={{ justifyContent: JUSTIFY[block.align] }}>
			<span
				className="inline-block rounded-lg px-[30px] py-[13px]"
				style={{
					backgroundColor: filled ? EMAIL_COLOR.brand : "transparent",
					border: `1px solid ${EMAIL_COLOR.brand}`,
				}}
			>
				<input
					aria-label="Libellé du bouton"
					value={block.label}
					onChange={(event) =>
						onChange({ ...block, label: event.target.value })
					}
					placeholder="Votre bouton"
					className="min-w-16 max-w-full border-none bg-transparent p-0 text-center font-semibold text-[15px] leading-none outline-none [field-sizing:content] placeholder:opacity-50"
					style={{
						fontFamily: EMAIL_FONT,
						color: filled ? "#ffffff" : EMAIL_COLOR.brand,
					}}
				/>
			</span>
		</div>
	);
}

function ButtonBlockSettings({
	block,
	onChange,
}: EmailBlockComponentProps<EmailEditorButtonBlock>) {
	return (
		<>
			<BlockOptionSection title="Contenu">
				<TextOption
					label="Libellé"
					value={block.label}
					onChange={(label) => onChange({ ...block, label })}
				/>
			</BlockOptionSection>
			<BlockOptionSection title="Apparence">
				<AlignmentOption
					value={block.align}
					onChange={(align) => onChange({ ...block, align })}
				/>
				<SelectOption
					label="Style"
					value={block.variant}
					options={VARIANT_OPTIONS}
					onChange={(variant) => onChange({ ...block, variant })}
					description={
						block.variant === "secondary"
							? "Outlook (moteur Word) ignore les coins arrondis : le contour y sera à angles droits."
							: undefined
					}
				/>
			</BlockOptionSection>
			<BlockOptionSection title="Lien">
				<LinkOption
					value={block.href}
					onChange={(href) => onChange({ ...block, href })}
				/>
			</BlockOptionSection>
		</>
	);
}

export const buttonBlockDefinition: EmailBlockDefinition<EmailEditorButtonBlock> =
	{
		label: "Bouton",
		icon: CursorClickIcon,
		View: ButtonBlockView,
		Settings: ButtonBlockSettings,
	};
