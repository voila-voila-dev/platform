import { Block } from "./fixtures";

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
