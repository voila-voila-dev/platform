import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { ProseArticle } from "@voila.dev/ui-landing/components/prose-article";

const meta = {
	title: "Landing/ProseArticle",
	component: ProseArticle,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
} satisfies Meta<typeof ProseArticle>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Reproduces the original Astro site's `blog/prose-content.astro`. */
export const Default: Story = {
	render: () => (
		<ProseArticle>
			<h2>Pourquoi médicaliser les événements sportifs amateurs ?</h2>
			<p>
				Chaque week-end, des milliers de matchs amateurs se jouent sans aucun
				encadrement médical. Pourtant, la présence d'un{" "}
				<strong>professionnel de santé</strong> au bord du terrain change tout.
			</p>
			<blockquote>
				<p>
					Être suivi par un pro pendant la saison a tout changé : moins de
					blessures, et le sentiment d'être enfin pris au sérieux.
				</p>
			</blockquote>
			<h3>Ce que dit la réglementation</h3>
			<p>
				Les fédérations recommandent un encadrement adapté au niveau de
				pratique. Consultez <a href="https://acme.dev">notre guide complet</a>{" "}
				pour connaître les obligations de votre discipline.
			</p>
			<ul>
				<li>Prévention des blessures avant l'effort</li>
				<li>Prise en charge immédiate sur le terrain</li>
				<li>Suivi et continuité médicale après l'événement</li>
			</ul>
		</ProseArticle>
	),
};
