import {
	type EmailBlockComponentProps,
	emailBlockDefinition,
} from "@voila.dev/ui-email-block-editor/blocks/block-definitions";
import { gridBlockDefinition } from "@voila.dev/ui-email-block-editor/blocks/grid-block";
import type {
	EmailEditorBlock,
	EmailEditorGridBlock,
	EmailEditorLeafBlock,
} from "@voila.dev/ui-email-block-editor/document/types";
import { EMAIL_COLOR } from "@voila.dev/ui-email-block-editor/theme";
import { type ReactNode, useState } from "react";

/** The 600px email card the blocks sit in inside the editor canvas. */
function EmailCard({ children }: { children: ReactNode }) {
	return (
		<div
			className="flex w-full justify-center rounded-lg p-4"
			style={{ backgroundColor: EMAIL_COLOR.canvas }}
		>
			<div
				className="w-full max-w-[600px] rounded-[14px] border px-6 py-5"
				style={{
					backgroundColor: EMAIL_COLOR.card,
					borderColor: EMAIL_COLOR.border,
				}}
			>
				{children}
			</div>
		</div>
	);
}

/**
 * One block, editable in place, exactly as the canvas renders it. The block is
 * local state so the previews on the docs site are genuinely editable.
 */
function Block({
	initial,
	onUploadImage,
}: {
	initial: EmailEditorBlock;
	onUploadImage?: EmailBlockComponentProps["onUploadImage"];
}) {
	const [block, setBlock] = useState(initial);
	const definition = emailBlockDefinition(block);
	return (
		<EmailCard>
			<definition.View
				block={block}
				selected={false}
				onChange={setBlock}
				onUploadImage={onUploadImage}
			/>
		</EmailCard>
	);
}

export function Heading() {
	return (
		<Block
			initial={{
				id: "heading",
				type: "heading",
				text: "Bonjour {{firstName}} !",
				level: 1,
			}}
		/>
	);
}

export function Paragraph() {
	return (
		<Block
			initial={{
				id: "paragraph",
				type: "paragraph",
				spans: [
					{ text: "Découvrez les " },
					{ text: "nouvelles missions", bold: true },
					{ text: " disponibles près de chez vous, ou consultez " },
					{ text: "votre espace", href: "https://app.acme.dev" },
					{ text: "." },
				],
			}}
		/>
	);
}

export function ButtonBlock() {
	return (
		<Block
			initial={{
				id: "button",
				type: "button",
				label: "Voir les missions",
				href: "https://app.acme.dev/missions",
				align: "center",
				variant: "primary",
			}}
		/>
	);
}

export function Image() {
	return (
		<Block
			initial={{
				id: "image",
				type: "image",
				src: "https://placehold.co/536x200/png",
				alt: "Visuel de la campagne",
				href: "",
				width: "full",
				overlay: "none",
				rounded: true,
			}}
		/>
	);
}

export function ImageEmpty() {
	return (
		<Block
			initial={{
				id: "image-empty",
				type: "image",
				src: "",
				alt: "",
				href: "",
				width: "full",
				overlay: "none",
				rounded: true,
			}}
			onUploadImage={async (file) => {
				await new Promise((resolve) => setTimeout(resolve, 600));
				return URL.createObjectURL(file);
			}}
		/>
	);
}

export function Divider() {
	return <Block initial={{ id: "divider", type: "divider" }} />;
}

export function List() {
	return (
		<Block
			initial={{
				id: "list",
				type: "list",
				marker: "badge",
				items: [
					{
						title: "Publiez votre mission",
						spans: [{ text: "En deux minutes, depuis votre espace." }],
					},
					{
						title: "Recevez des candidatures",
						spans: [
							{ text: "Des professionnels " },
							{ text: "vérifiés", bold: true },
							{ text: " près de chez vous." },
						],
					},
					{ spans: [{ text: "Payez une fois la mission terminée." }] },
				],
			}}
		/>
	);
}

export function Stat() {
	return (
		<Block
			initial={{
				id: "stat",
				type: "stat",
				value: "1 240",
				label: "Missions pourvues",
				description: "Sur les douze derniers mois.",
				align: "center",
			}}
		/>
	);
}

export function Table() {
	return (
		<Block
			initial={{
				id: "table",
				type: "table",
				headerRow: true,
				columns: [
					{ label: "Prestation", align: "left" },
					{ label: "Durée", align: "left" },
					{ label: "Tarif", align: "right" },
				],
				rows: [
					["Kinésithérapie", "1 h", "60,00 €"],
					["Ostéopathie", "45 min", "55,00 €"],
					["Bilan postural", "30 min", "40,00 €"],
				],
			}}
		/>
	);
}

export function Article() {
	return (
		<Block
			initial={{
				id: "article",
				type: "article",
				title: "Bien choisir son kinésithérapeute",
				description:
					"Diplôme, spécialité, disponibilités : les trois critères qui comptent vraiment.",
				image: {
					src: "https://placehold.co/536x180/png",
					alt: "Séance de kiné",
				},
				author: "Emma Martin",
				publishDate: "2026-07-20",
				href: "https://acme.dev/blog/choisir-son-kine",
			}}
		/>
	);
}

export function Product() {
	return (
		<Block
			initial={{
				id: "product",
				type: "product",
				name: "Bande de contention Essity",
				description: "Boîte de 10, largeur 10 cm.",
				image: { src: "https://placehold.co/536x180/png", alt: "Bande" },
				price: { amountInMinorUnits: 5990, currency: "EUR" },
				compareAtPrice: { amountInMinorUnits: 7990, currency: "EUR" },
				href: "https://shop.acme.dev/bande-contention",
				buttonLabel: "Commander",
			}}
		/>
	);
}

export function Offer() {
	return (
		<Block
			initial={{
				id: "offer",
				type: "offer",
				eyebrow: "Le plus choisi",
				name: "Essentiel",
				description: "Le socle pour recruter en continu.",
				image: { src: "", alt: "" },
				price: { amountInMinorUnits: 2900, currency: "EUR" },
				period: "par mois",
				features: [
					"Missions illimitées",
					"Professionnels vérifiés",
					"Support 7j/7",
				],
				buttonLabel: "Choisir cette offre",
				buttonHref: "https://acme.dev/offres",
				highlighted: true,
			}}
		/>
	);
}

export function Rating() {
	return (
		<Block
			initial={{
				id: "rating",
				type: "rating",
				question: [{ text: "Que pensez-vous de votre dernière mission ?" }],
				style: "filled",
				lowLabel: "Pas du tout",
				highLabel: "Tout à fait",
				href: "https://acme.dev/avis",
			}}
		/>
	);
}

/**
 * The grid is a container: the canvas composes its cells and slots them in as
 * `children`. Here the cells are two plain leaf blocks, which is enough to show
 * the layout the block owns.
 */
export function Grid() {
	const [block, setBlock] = useState<EmailEditorGridBlock>({
		id: "grid",
		type: "grid",
		desktopColumns: 2,
		mobileColumns: 1,
		children: [
			{
				id: "grid-stat-1",
				type: "stat",
				value: "1 240",
				label: "Missions pourvues",
				description: "",
				align: "center",
			},
			{
				id: "grid-stat-2",
				type: "stat",
				value: "4,8 / 5",
				label: "Note moyenne",
				description: "",
				align: "center",
			},
		],
	});
	return (
		<EmailCard>
			<gridBlockDefinition.View
				block={block}
				selected={false}
				onChange={setBlock}
			>
				{block.children.map((child) => (
					<GridCell key={child.id} block={child} />
				))}
			</gridBlockDefinition.View>
		</EmailCard>
	);
}

function GridCell({ block: initial }: { block: EmailEditorLeafBlock }) {
	const [block, setBlock] = useState<EmailEditorBlock>(initial);
	const definition = emailBlockDefinition(block);
	return <definition.View block={block} selected={false} onChange={setBlock} />;
}
