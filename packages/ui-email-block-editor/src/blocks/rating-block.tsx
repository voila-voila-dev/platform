import { StarIcon } from "@phosphor-icons/react";
import type {
	EmailBlockComponentProps,
	EmailBlockDefinition,
} from "#/blocks/block-definitions.tsx";
import { RichTextEditable } from "#/blocks/rich-text-editable.tsx";
import type {
	EmailEditorRatingBlock,
	EmailEditorRatingStyle,
} from "#/document/types.ts";
import { BlockOptionSection } from "#/sections/block-options/block-option-row.tsx";
import { SelectOption } from "#/sections/block-options/select-option.tsx";
import {
	LinkOption,
	TextOption,
} from "#/sections/block-options/text-option.tsx";
import { EMAIL_COLOR, EMAIL_FONT } from "#/theme.ts";

/** The scale, mirroring the domain's `EMAIL_RATING_SCALE`. */
const RATING_SCALE = [1, 2, 3, 4, 5] as const;

const STYLE_OPTIONS: ReadonlyArray<{
	readonly value: EmailEditorRatingStyle;
	readonly label: string;
}> = [
	{ value: "filled", label: "Étoiles pleines" },
	{ value: "outline", label: "Étoiles contour" },
];

/**
 * A one-to-five satisfaction question. In the sent email each star is its own
 * link carrying `?rating=N`, which makes the five steps five separately
 * countable tracked links; on the canvas they are inert.
 */
function RatingBlockView({
	block,
	onChange,
}: EmailBlockComponentProps<EmailEditorRatingBlock>) {
	return (
		<div className="flex flex-col items-center gap-3 text-center">
			<RichTextEditable
				spans={block.question}
				onChange={(question) => onChange({ ...block, question })}
				ariaLabel="Question"
				placeholder="Que pensez-vous de votre dernière mission ?"
				className="text-center text-[16px] leading-[1.6]"
				style={{ fontFamily: EMAIL_FONT, color: EMAIL_COLOR.ink }}
			/>
			<div className="flex items-center gap-2" aria-hidden>
				{RATING_SCALE.map((rating) => (
					<StarIcon
						key={rating}
						size={30}
						weight={block.style === "filled" ? "fill" : "regular"}
						color={EMAIL_COLOR.brand}
					/>
				))}
			</div>
			{block.lowLabel === "" && block.highLabel === "" ? null : (
				<div
					className="flex w-full max-w-[220px] justify-between text-[12px]"
					style={{ color: EMAIL_COLOR.muted, fontFamily: EMAIL_FONT }}
				>
					<span>{block.lowLabel}</span>
					<span>{block.highLabel}</span>
				</div>
			)}
		</div>
	);
}

function RatingBlockSettings({
	block,
	onChange,
}: EmailBlockComponentProps<EmailEditorRatingBlock>) {
	return (
		<>
			<BlockOptionSection title="Contenu">
				<p className="text-muted-foreground text-xs">
					La question se saisit et se met en forme directement sur le bloc,
					comme un paragraphe.
				</p>
				<TextOption
					label="Libellé bas de l'échelle"
					value={block.lowLabel}
					onChange={(lowLabel) => onChange({ ...block, lowLabel })}
					placeholder="Pas du tout"
				/>
				<TextOption
					label="Libellé haut de l'échelle"
					value={block.highLabel}
					onChange={(highLabel) => onChange({ ...block, highLabel })}
					placeholder="Tout à fait"
				/>
			</BlockOptionSection>
			<BlockOptionSection title="Apparence">
				<SelectOption
					label="Style"
					value={block.style}
					options={STYLE_OPTIONS}
					onChange={(style) => onChange({ ...block, style })}
				/>
			</BlockOptionSection>
			<BlockOptionSection title="Lien">
				<LinkOption
					value={block.href}
					onChange={(href) => onChange({ ...block, href })}
					description="Chaque étoile pointe vers cette adresse avec « rating=1 » à « rating=5 » ajouté : les cinq notes sont donc comptées séparément dans les statistiques de clic."
				/>
			</BlockOptionSection>
		</>
	);
}

export const ratingBlockDefinition: EmailBlockDefinition<EmailEditorRatingBlock> =
	{
		label: "Notation",
		icon: StarIcon,
		View: RatingBlockView,
		Settings: RatingBlockSettings,
	};
