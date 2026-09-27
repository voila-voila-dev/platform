import { ratingFeature } from "@voila.dev/ui/content-editor";
import { CardEditor } from "./card-editor";

const [rating] = ratingFeature.nodes;

export function Rating() {
	return (
		<CardEditor
			initial={[
				rating.createNode({
					children: [{ text: "How did your last project go?" }],
					lowLabel: "Not at all",
					highLabel: "Absolutely",
					href: "https://acme.dev/survey",
				}),
				{ type: "p", children: [{ text: "" }] },
			]}
		/>
	);
}
