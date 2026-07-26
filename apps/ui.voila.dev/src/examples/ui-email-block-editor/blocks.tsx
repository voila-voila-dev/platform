import {
	EMAIL_BLOCK_DEFINITIONS,
	EMAIL_COLOR,
	type EmailBlockComponentProps,
	EmailBlockEditor,
	type EmailEditorBlock,
	type EmailEditorDocument,
	type EmailEditorGridBlock,
	type EmailEditorLeafBlock,
	emailBlockDefinition,
} from "@voila.dev/ui/email-block-editor";
import { type ReactNode, useState } from "react";

/** Fake upload for the docs previews: no backend here, so the picked file is
 * served from an object URL — a real app returns the uploaded file's URL. */
const fakeUploadImage = async (file: File) => {
	await new Promise((resolve) => setTimeout(resolve, 600));
	return URL.createObjectURL(file);
};

/** The quick-start hero: a welcome email, in the full composed editor. */
const welcomeDocument: EmailEditorDocument = {
	version: 1,
	blocks: [
		{
			id: "heading",
			type: "heading",
			text: "Welcome {{firstName}}!",
			level: 1,
		},
		{
			id: "intro",
			type: "paragraph",
			spans: [
				{ text: "Your account is ready. Post your " },
				{ text: "first project", bold: true },
				{ text: " from " },
				{ text: "your workspace", href: "https://app.acme.dev" },
				{ text: " and receive your first proposals this week." },
			],
		},
		{
			id: "stats",
			type: "grid",
			desktopColumns: 2,
			mobileColumns: 2,
			children: [
				{
					id: "stat-projects",
					type: "stat",
					value: "1,240",
					label: "Projects staffed",
					description: "",
					align: "center",
				},
				{
					id: "stat-note",
					type: "stat",
					value: "4.8 / 5",
					label: "Average rating",
					description: "",
					align: "center",
				},
			],
		},
		{
			id: "cta",
			type: "button",
			label: "Post a project",
			href: "https://app.acme.dev/projects",
			align: "center",
			variant: "primary",
		},
		{ id: "divider", type: "divider" },
		{
			id: "rating",
			type: "rating",
			question: [{ text: "How was your onboarding experience?" }],
			style: "filled",
			lowLabel: "Not at all",
			highLabel: "Absolutely",
			href: "https://acme.dev/reviews",
		},
	],
};

export function Editor() {
	const [document, setDocument] = useState(welcomeDocument);
	return (
		<EmailBlockEditor
			document={document}
			onChange={setDocument}
			onUploadImage={fakeUploadImage}
		/>
	);
}

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
				text: "Hello {{firstName}}!",
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
					{ text: "Browse the " },
					{ text: "latest projects", bold: true },
					{ text: " that match your skills, or head to " },
					{ text: "your workspace", href: "https://app.acme.dev" },
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
				label: "Browse projects",
				href: "https://app.acme.dev/projects",
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
				alt: "Campaign visual",
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
			onUploadImage={fakeUploadImage}
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
						title: "Post your project",
						spans: [{ text: "In two minutes, from your workspace." }],
					},
					{
						title: "Receive proposals",
						spans: [
							{ text: "From " },
							{ text: "verified", bold: true },
							{ text: " freelancers, within hours." },
						],
					},
					{ spans: [{ text: "Pay once the project is delivered." }] },
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
				value: "1,240",
				label: "Projects staffed",
				description: "Over the last twelve months.",
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
					{ label: "Service", align: "left" },
					{ label: "Duration", align: "left" },
					{ label: "Rate", align: "right" },
				],
				rows: [
					["Design review", "1 h", "$60.00"],
					["Code audit", "45 min", "$55.00"],
					["Kickoff call", "30 min", "$40.00"],
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
				title: "How to choose the right freelancer",
				description:
					"Portfolio, reviews, availability: the three criteria that really matter.",
				image: {
					src: "https://placehold.co/536x180/png",
					alt: "Freelancer at work",
				},
				author: "Emma Martin",
				publishDate: "2026-07-20",
				href: "https://acme.dev/blog/choose-a-freelancer",
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
				name: "Acme brand kit template",
				description: "Logo, palette, and type specimen.",
				image: { src: "https://placehold.co/536x180/png", alt: "Kit" },
				price: { amountInMinorUnits: 5990, currency: "EUR" },
				compareAtPrice: { amountInMinorUnits: 7990, currency: "EUR" },
				href: "https://shop.acme.dev/brand-kit-template",
				buttonLabel: "Buy now",
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
				eyebrow: "Most popular",
				name: "Essential",
				description: "The core plan for hiring on repeat.",
				image: { src: "", alt: "" },
				price: { amountInMinorUnits: 2900, currency: "EUR" },
				period: "per month",
				features: [
					"Unlimited projects",
					"Verified freelancers",
					"7-day support",
				],
				buttonLabel: "Choose this plan",
				buttonHref: "https://acme.dev/pricing",
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
				question: [{ text: "How did your latest project go?" }],
				style: "filled",
				lowLabel: "Not at all",
				highLabel: "Absolutely",
				href: "https://acme.dev/reviews",
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
				value: "1,240",
				label: "Projects staffed",
				description: "",
				align: "center",
			},
			{
				id: "grid-stat-2",
				type: "stat",
				value: "4.8 / 5",
				label: "Average rating",
				description: "",
				align: "center",
			},
		],
	});
	return (
		<EmailCard>
			<EMAIL_BLOCK_DEFINITIONS.grid.View
				block={block}
				selected={false}
				onChange={setBlock}
			>
				{block.children.map((child) => (
					<GridCell key={child.id} block={child} />
				))}
			</EMAIL_BLOCK_DEFINITIONS.grid.View>
		</EmailCard>
	);
}

function GridCell({ block: initial }: { block: EmailEditorLeafBlock }) {
	const [block, setBlock] = useState<EmailEditorBlock>(initial);
	const definition = emailBlockDefinition(block);
	return <definition.View block={block} selected={false} onChange={setBlock} />;
}
