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
				<Eyebrow.Label>How it works</Eyebrow.Label>
			</Eyebrow.Root>
			<SectionIntro.Title>Two journeys, one meeting point</SectionIntro.Title>
			<SectionIntro.Description>
				Staff your project on the client side, find your next engagements on the
				freelancer side: three steps is all it takes.
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
				<Eyebrow.Label>In their words</Eyebrow.Label>
			</Eyebrow.Root>
			<SectionIntro.Title>
				A committed community around a{" "}
				<span className="text-primary">shared conviction</span>
			</SectionIntro.Title>
			<SectionIntro.Description>
				Clients, freelancers and partners are united around a common vision:
				building a way of working that is fairer, more effective and durable.
			</SectionIntro.Description>
		</SectionIntro.Root>
	),
};
