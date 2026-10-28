import { articleFeature } from "@voila.dev/ui/content-editor";
import { CardEditor } from "./card-editor";

const [article] = articleFeature.nodes;

export function Article() {
	return (
		<CardEditor
			initial={[
				article.createNode({
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
				}),
				{ type: "p", children: [{ text: "" }] },
			]}
		/>
	);
}
