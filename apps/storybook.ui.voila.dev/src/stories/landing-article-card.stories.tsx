import { CalendarBlankIcon, ClockIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	ArticleCard,
	ArticleTags,
} from "@voila.dev/ui-landing/components/article-card";
import { partnerLogoDataUri } from "./landing-fixtures";

const meta = {
	title: "Landing/ArticleCard",
	component: ArticleCard.Root,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
} satisfies Meta<typeof ArticleCard.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

function CardContent() {
	return (
		<ArticleCard.Content>
			<ArticleCard.Tags>
				<ArticleTags.Tag>Playbook</ArticleTags.Tag>
				<ArticleTags.Tag>Freelancing</ArticleTags.Tag>
			</ArticleCard.Tags>
			<ArticleCard.Title>
				Why every product launch deserves a dedicated designer
			</ArticleCard.Title>
			<ArticleCard.Description>
				Every quarter, thousands of launches ship without a single design
				review. Here is what that changes.
			</ArticleCard.Description>
			<ArticleCard.Meta>
				<ArticleCard.MetaItems>
					<ArticleCard.MetaItem>
						<CalendarBlankIcon />
						July 12, 2026
					</ArticleCard.MetaItem>
					<ArticleCard.MetaItem>
						<ClockIcon />5 min read
					</ArticleCard.MetaItem>
				</ArticleCard.MetaItems>
				<ArticleCard.Arrow />
			</ArticleCard.Meta>
		</ArticleCard.Content>
	);
}

/** Reproduces the original Astro site's `blog/article-card.astro`. */
export const WithImage: Story = {
	render: () => (
		<div className="max-w-md">
			<ArticleCard.Root href="/blog/example">
				<ArticleCard.Frame>
					<ArticleCard.Image
						src={partnerLogoDataUri("Cover")}
						alt="Article cover"
					/>
					<CardContent />
				</ArticleCard.Frame>
			</ArticleCard.Root>
		</div>
	),
};

export const WithoutImage: Story = {
	render: () => (
		<div className="max-w-md">
			<ArticleCard.Root href="/blog/example">
				<ArticleCard.Frame>
					<ArticleCard.ImageFallback />
					<CardContent />
				</ArticleCard.Frame>
			</ArticleCard.Root>
		</div>
	),
};

export const Grid: Story = {
	render: () => (
		<div className="grid gap-6 md:grid-cols-3">
			{["Playbook", "Process", "Network"].map((tag) => (
				<ArticleCard.Root key={tag} href="/blog/example">
					<ArticleCard.Frame>
						<ArticleCard.ImageFallback />
						<ArticleCard.Content>
							<ArticleCard.Tags>
								<ArticleTags.Tag>{tag}</ArticleTags.Tag>
							</ArticleCard.Tags>
							<ArticleCard.Title>
								An article on the theme “{tag}”
							</ArticleCard.Title>
							<ArticleCard.Description>
								Every quarter, thousands of launches ship without a single
								design review.
							</ArticleCard.Description>
							<ArticleCard.Meta>
								<ArticleCard.MetaItems>
									<ArticleCard.MetaItem>
										<CalendarBlankIcon />
										July 12, 2026
									</ArticleCard.MetaItem>
								</ArticleCard.MetaItems>
								<ArticleCard.Arrow />
							</ArticleCard.Meta>
						</ArticleCard.Content>
					</ArticleCard.Frame>
				</ArticleCard.Root>
			))}
		</div>
	),
};
