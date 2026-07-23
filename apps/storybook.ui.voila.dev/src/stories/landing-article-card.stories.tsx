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
				<ArticleTags.Tag>Prévention</ArticleTags.Tag>
				<ArticleTags.Tag>Kiné du sport</ArticleTags.Tag>
			</ArticleCard.Tags>
			<ArticleCard.Title>
				Pourquoi médicaliser les événements sportifs amateurs ?
			</ArticleCard.Title>
			<ArticleCard.Description>
				Chaque week-end, des milliers de matchs amateurs se jouent sans aucun
				encadrement médical. Voici ce que ça change.
			</ArticleCard.Description>
			<ArticleCard.Meta>
				<ArticleCard.MetaItems>
					<ArticleCard.MetaItem>
						<CalendarBlankIcon />
						12 juillet 2026
					</ArticleCard.MetaItem>
					<ArticleCard.MetaItem>
						<ClockIcon />5 min de lecture
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
			<ArticleCard.Root href="/blog/exemple">
				<ArticleCard.Frame>
					<ArticleCard.Image
						src={partnerLogoDataUri("Couverture")}
						alt="Couverture de l'article"
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
			<ArticleCard.Root href="/blog/exemple">
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
			{["Prévention", "Terrain", "Réseau"].map((tag) => (
				<ArticleCard.Root key={tag} href="/blog/exemple">
					<ArticleCard.Frame>
						<ArticleCard.ImageFallback />
						<ArticleCard.Content>
							<ArticleCard.Tags>
								<ArticleTags.Tag>{tag}</ArticleTags.Tag>
							</ArticleCard.Tags>
							<ArticleCard.Title>
								Un article sur le thème « {tag} »
							</ArticleCard.Title>
							<ArticleCard.Description>
								Chaque week-end, des milliers de matchs amateurs se jouent sans
								encadrement médical.
							</ArticleCard.Description>
							<ArticleCard.Meta>
								<ArticleCard.MetaItems>
									<ArticleCard.MetaItem>
										<CalendarBlankIcon />
										12 juillet 2026
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
