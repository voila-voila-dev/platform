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
			<h2>Why every product launch deserves a dedicated designer</h2>
			<p>
				Every quarter, thousands of launches ship without a single design
				review. Yet having a <strong>dedicated freelancer</strong> embedded in
				the team changes everything.
			</p>
			<blockquote>
				<p>
					Having an expert embedded all quarter changed everything: fewer
					reworks, and the feeling of finally being taken seriously.
				</p>
			</blockquote>
			<h3>What the playbook says</h3>
			<p>
				Experienced teams recommend support that matches the scale of the
				launch. Read <a href="https://acme.dev">our complete guide</a> to find
				out what your project really needs.
			</p>
			<ul>
				<li>Reviews that catch issues before the launch</li>
				<li>Immediate fixes while the work is in flight</li>
				<li>Follow-up and continuity after the release</li>
			</ul>
		</ProseArticle>
	),
};
