import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Eyebrow } from "@voila.dev/ui-landing/components/eyebrow";
import {
	SectionIntro,
	sectionIntroSpacingOptions,
	sectionIntroWidthOptions,
} from "@voila.dev/ui-landing/components/section-intro";

const meta = {
	title: "Landing/SectionIntro",
	component: SectionIntro.Root,
	tags: ["autodocs"],
	argTypes: {
		width: {
			control: "select",
			options: sectionIntroWidthOptions,
		},
		spacing: {
			control: "select",
			options: sectionIntroSpacingOptions,
		},
	},
	render: (args) => (
		<SectionIntro.Root {...args}>
			<Eyebrow.Root tone="primary" className="mb-4">
				<Eyebrow.Label>Comment ça marche ?</Eyebrow.Label>
			</Eyebrow.Root>
			<SectionIntro.Title>Deux parcours, une rencontre</SectionIntro.Title>
			<SectionIntro.Description>
				Staffez votre événement côté club, trouvez vos missions côté
				professionnel de santé : trois étapes suffisent.
			</SectionIntro.Description>
		</SectionIntro.Root>
	),
} satisfies Meta<typeof SectionIntro.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHighlight: Story = {
	render: () => (
		<SectionIntro.Root>
			<Eyebrow.Root tone="primary" className="mb-4">
				<Eyebrow.Label>Ils en parlent</Eyebrow.Label>
			</Eyebrow.Root>
			<SectionIntro.Title>
				Une communauté engagée autour d'une{" "}
				<span className="text-primary">même conviction</span>
			</SectionIntro.Title>
			<SectionIntro.Description>
				Clubs, sportifs et professionnels sont réunis autour d'une vision
				commune : créer un écosystème plus sûr, plus performant et plus durable.
			</SectionIntro.Description>
		</SectionIntro.Root>
	),
};
