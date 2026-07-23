import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	type EmailBlockComponentProps,
	emailBlockDefinition,
} from "@voila.dev/ui-email-block-editor/blocks/block-definitions";
import type { EmailEditorBlock } from "@voila.dev/ui-email-block-editor/document/types";
import { EMAIL_COLOR } from "@voila.dev/ui-email-block-editor/theme";
import { type ReactNode, useState } from "react";

const meta = {
	title: "EmailBlockEditor/Blocks",
	tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/** The 600px email card the blocks live in inside the editor canvas. */
function EmailCard({ children }: { children: ReactNode }) {
	return (
		<div
			className="flex justify-center rounded-lg p-8"
			style={{ backgroundColor: EMAIL_COLOR.canvas }}
		>
			<div
				className="w-full max-w-[600px] rounded-[14px] border px-8 py-6"
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

function BlockStory({
	initial,
	selected = false,
	onUploadImage,
}: {
	initial: EmailEditorBlock;
	selected?: boolean;
	onUploadImage?: EmailBlockComponentProps["onUploadImage"];
}) {
	const [block, setBlock] = useState(initial);
	const definition = emailBlockDefinition(block);
	return (
		<EmailCard>
			<definition.View
				block={block}
				selected={selected}
				onChange={setBlock}
				onUploadImage={onUploadImage}
			/>
		</EmailCard>
	);
}

export const Heading: Story = {
	render: () => (
		<BlockStory
			initial={{
				id: "heading",
				type: "heading",
				text: "Bonjour {{firstName}} !",
				level: 1,
			}}
		/>
	),
};

export const Paragraph: Story = {
	render: () => (
		<BlockStory
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
	),
};

export const CallToActionButton: Story = {
	render: () => (
		<BlockStory
			initial={{
				id: "button",
				type: "button",
				label: "Voir les missions",
				href: "https://app.acme.dev/missions",
				align: "center",
				variant: "primary",
			}}
		/>
	),
};

export const Image: Story = {
	render: () => (
		<BlockStory
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
	),
};

export const ImageEmpty: Story = {
	render: () => (
		<BlockStory
			initial={{
				id: "image",
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
	),
};

export const Divider: Story = {
	render: () => <BlockStory initial={{ id: "divider", type: "divider" }} />,
};

export const List: Story = {
	render: () => (
		<BlockStory
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
	),
};

export const Stat: Story = {
	render: () => (
		<BlockStory
			initial={{
				id: "stat",
				type: "stat",
				value: "1 240",
				label: "Missions pourvues",
				description: "Sur les douze derniers mois.",
				align: "center",
			}}
		/>
	),
};

export const Table: Story = {
	render: () => (
		<BlockStory
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
	),
};

export const Article: Story = {
	render: () => (
		<BlockStory
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
	),
};

export const Product: Story = {
	render: () => (
		<BlockStory
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
	),
};

export const Offer: Story = {
	render: () => (
		<BlockStory
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
	),
};

export const Rating: Story = {
	render: () => (
		<BlockStory
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
	),
};

/**
 * The empty state, where the placeholder shows. It belongs on its own line
 * above the stars: the placeholder is an absolutely-positioned pseudo-element,
 * so a centred block used to start it mid-line and let it spill over the stars.
 */
export const RatingEmpty: Story = {
	render: () => (
		<BlockStory
			initial={{
				id: "rating-empty",
				type: "rating",
				question: [],
				style: "filled",
				lowLabel: "",
				highLabel: "",
				href: "",
			}}
		/>
	),
};
