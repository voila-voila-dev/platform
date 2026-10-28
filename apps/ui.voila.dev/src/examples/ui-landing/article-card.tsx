import { CalendarBlankIcon } from "@phosphor-icons/react";
import {
	ArticleCard,
	ArticleTags as ArticleTagsParts,
} from "@voila.dev/ui/landing";
import { partnerLogoDataUri } from "./fixtures";

export function Default() {
	return (
		<div className="max-w-md">
			<ArticleCard.Root href="#">
				<ArticleCard.Frame>
					<ArticleCard.Image
						src={partnerLogoDataUri("Cover")}
						alt="Article cover"
					/>
					<ArticleCard.Content>
						<ArticleCard.Tags>
							<ArticleTagsParts.Tag>Remote work</ArticleTagsParts.Tag>
							<ArticleTagsParts.Tag>Product design</ArticleTagsParts.Tag>
						</ArticleCard.Tags>
						<ArticleCard.Title>
							Why every launch deserves a dedicated freelancer
						</ArticleCard.Title>
						<ArticleCard.Description>
							Every week, thousands of product launches ship without any
							dedicated design support.
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
		</div>
	);
}

export function Fallback() {
	return (
		<div className="max-w-md">
			<ArticleCard.Root href="#">
				<ArticleCard.Frame>
					<ArticleCard.ImageFallback />
					<ArticleCard.Content>
						<ArticleCard.Title>An article without a visual</ArticleCard.Title>
						<ArticleCard.Description>
							The card keeps the same layout, with a flat fill in place of the
							image.
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
		</div>
	);
}
