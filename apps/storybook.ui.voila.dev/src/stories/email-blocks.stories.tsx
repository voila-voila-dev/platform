import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	createEmailBlockRegistry,
	createEmailBlocks,
	DEFAULT_EMAIL_EDITOR_THEME,
	type EmailBlockComponentProps,
	type EmailEditorBuiltInBlock,
} from "@voila.dev/ui/email-block-editor";
import { type ReactNode, useState } from "react";

const STORY_REGISTRY = createEmailBlockRegistry(
	createEmailBlocks({ currency: "EUR" }),
);

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
			style={{ backgroundColor: DEFAULT_EMAIL_EDITOR_THEME.color.canvas }}
		>
			<div
				className="w-full max-w-[600px] rounded-[14px] border px-8 py-6"
				style={{
					backgroundColor: DEFAULT_EMAIL_EDITOR_THEME.color.card,
					borderColor: DEFAULT_EMAIL_EDITOR_THEME.color.border,
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
	initial: EmailEditorBuiltInBlock;
	selected?: boolean;
	onUploadImage?: EmailBlockComponentProps["onUploadImage"];
}) {
	const [block, setBlock] = useState(initial);
	const definition = STORY_REGISTRY.definitionFor(block.type);
	if (definition === undefined) {
		return null;
	}
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
				text: "Hello {{firstName}}!",
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
					{ text: "Discover the " },
					{ text: "new projects", bold: true },
					{ text: " published in your field, or head to " },
					{ text: "your dashboard", href: "https://app.acme.dev" },
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
				label: "Browse projects",
				href: "https://app.acme.dev/projects",
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
				alt: "Campaign visual",
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
						spans: [
							{ text: "Post your project", bold: true },
							{ text: " in two minutes, from your dashboard." },
						],
					},
					{
						spans: [
							{ text: "Receive applications from " },
							{ text: "verified", bold: true },
							{ text: " freelancers, ready to start." },
						],
					},
					{ spans: [{ text: "Pay once the project is delivered." }] },
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
				value: "1,240",
				label: "Projects staffed",
				description: "Over the last twelve months.",
				align: "center",
			}}
		/>
	),
};

export const Highlight: Story = {
	render: () => (
		<BlockStory
			initial={{
				id: "highlight",
				type: "highlight",
				text: "\u{1F381} 10% off everything with the code LAUNCH10, until August 31",
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
					{ label: "Service", align: "left" },
					{ label: "Duration", align: "left" },
					{ label: "Rate", align: "right" },
				],
				rows: [
					["UX design", "1 h", "€60.00"],
					["Copywriting", "45 min", "€55.00"],
					["Design audit", "30 min", "€40.00"],
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
				title: "How to choose your freelance designer",
				description:
					"Portfolio, specialty, availability: the three criteria that really matter.",
				image: {
					src: "https://placehold.co/536x180/png",
					alt: "Design session",
				},
				author: "Emma Martin",
				publishDate: "2026-07-20",
				href: "https://acme.dev/blog/choosing-a-designer",
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
				name: "Landing page template pack",
				description: "Set of 10, fully responsive.",
				image: { src: "https://placehold.co/536x180/png", alt: "Template" },
				price: { amountInMinorUnits: 5990, currency: "EUR" },
				compareAtPrice: { amountInMinorUnits: 7990, currency: "EUR" },
				href: "https://shop.acme.dev/template-pack",
				buttonLabel: "Order now",
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
				eyebrow: "Most popular",
				name: "Essential",
				description: "The foundation for hiring on repeat.",
				image: { src: "", alt: "" },
				price: { amountInMinorUnits: 2900, currency: "EUR" },
				period: "per month",
				features: [
					"Unlimited projects",
					"Verified freelancers",
					"7-day support",
				],
				buttonLabel: "Choose this plan",
				buttonHref: "https://acme.dev/plans",
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
				question: [{ text: "How was your latest project?" }],
				style: "filled",
				lowLabel: "Not at all",
				highLabel: "Absolutely",
				href: "https://acme.dev/reviews",
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

export const FinePrint: Story = {
	render: () => (
		<BlockStory
			initial={{
				id: "fine-print",
				type: "finePrint",
				spans: [
					{
						text: "LAUNCH10: 10% off the order total, valid until August 31 at 11:59pm. One use per customer. See the ",
					},
					{ text: "terms and conditions", href: "https://acme.dev/terms" },
					{ text: "." },
				],
			}}
		/>
	),
};
