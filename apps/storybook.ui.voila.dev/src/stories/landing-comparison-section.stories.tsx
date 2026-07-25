import {
	ArrowRightIcon,
	BuildingsIcon,
	PenNibIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import { ComparisonSection } from "@voila.dev/ui/landing/comparison-section";
import { Eyebrow } from "@voila.dev/ui/landing/eyebrow";
import { Heading } from "@voila.dev/ui/landing/heading";
import { Text } from "@voila.dev/ui/landing/text";
import {
	clientBenefits,
	freelancerBenefits,
	IllustrationPlaceholder,
} from "./landing-fixtures";

const meta = {
	title: "Landing/ComparisonSection",
	component: ComparisonSection.Root,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof ComparisonSection.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Reproduces the original Astro site's client-benefits section. */
export const ClientBenefits: Story = {
	render: () => (
		<ComparisonSection.Root tone="highlight" background="muted">
			<ComparisonSection.Content>
				<Eyebrow.Root tone="highlight" className="mb-4">
					<Eyebrow.Icon>
						<BuildingsIcon />
					</Eyebrow.Icon>
					<Eyebrow.Label>{clientBenefits.badge}</Eyebrow.Label>
				</Eyebrow.Root>

				<Heading className="mb-8">
					{clientBenefits.titleStart}{" "}
					<span className="text-highlight">
						{clientBenefits.titleHighlight}
					</span>
				</Heading>

				<ComparisonSection.Panels>
					<ComparisonSection.Panel variant="without">
						<ComparisonSection.PanelTitle>
							{clientBenefits.withoutTitle}
						</ComparisonSection.PanelTitle>
						<ComparisonSection.PanelList>
							{clientBenefits.withoutItems.map((item, index) => (
								<ComparisonSection.PanelItem
									key={item}
									style={{ animationDelay: `${index * 0.08}s` }}
								>
									{item}
								</ComparisonSection.PanelItem>
							))}
						</ComparisonSection.PanelList>
					</ComparisonSection.Panel>

					<ComparisonSection.Panel
						variant="with"
						style={{ animationDelay: "0.3s" }}
					>
						<ComparisonSection.PanelTitle>
							{clientBenefits.withTitle}
						</ComparisonSection.PanelTitle>
						<ComparisonSection.PanelList>
							{clientBenefits.withItems.map((item, index) => (
								<ComparisonSection.PanelItem
									key={item}
									style={{ animationDelay: `${0.3 + index * 0.08}s` }}
								>
									{item}
								</ComparisonSection.PanelItem>
							))}
						</ComparisonSection.PanelList>
					</ComparisonSection.Panel>
				</ComparisonSection.Panels>

				<ComparisonSection.TagList>
					{clientBenefits.tags.map((tag) => (
						<ComparisonSection.Tag key={tag}>{tag}</ComparisonSection.Tag>
					))}
				</ComparisonSection.TagList>

				<Button
					size="lg"
					variant="highlight"
					className="group h-auto min-h-11 max-w-full whitespace-normal py-2 text-center"
				>
					{clientBenefits.cta}
					<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</Button>
			</ComparisonSection.Content>

			<ComparisonSection.Media>
				<IllustrationPlaceholder label="ClientDashboardIllustration (app-side)" />
			</ComparisonSection.Media>
		</ComparisonSection.Root>
	),
};

/** Reproduces the original Astro site's `section-helper-benefits.astro`. */
export const HelperBenefits: Story = {
	render: () => (
		<ComparisonSection.Root tone="brand">
			<ComparisonSection.Content>
				<Eyebrow.Root tone="brand" className="mb-4">
					<Eyebrow.Icon>
						<PenNibIcon />
					</Eyebrow.Icon>
					<Eyebrow.Label>{freelancerBenefits.badge}</Eyebrow.Label>
				</Eyebrow.Root>

				<Heading className="mb-4">
					{freelancerBenefits.titleStart}{" "}
					<span className="text-brand lg:block">
						{freelancerBenefits.titleHighlight}
					</span>
				</Heading>

				<Text variant="lead" className="mb-8">
					{freelancerBenefits.lead}
				</Text>

				<ComparisonSection.Panels>
					<ComparisonSection.Panel variant="without">
						<ComparisonSection.PanelTitle>
							{freelancerBenefits.withoutTitle}
						</ComparisonSection.PanelTitle>
						<ComparisonSection.PanelList>
							{freelancerBenefits.withoutItems.map((item) => (
								<ComparisonSection.PanelItem key={item}>
									{item}
								</ComparisonSection.PanelItem>
							))}
						</ComparisonSection.PanelList>
					</ComparisonSection.Panel>

					<ComparisonSection.Panel variant="with">
						<ComparisonSection.PanelTitle>
							{freelancerBenefits.withTitle}
						</ComparisonSection.PanelTitle>
						<ComparisonSection.PanelList>
							{freelancerBenefits.withItems.map((item) => (
								<ComparisonSection.PanelItem key={item}>
									{item}
								</ComparisonSection.PanelItem>
							))}
						</ComparisonSection.PanelList>
					</ComparisonSection.Panel>
				</ComparisonSection.Panels>

				<ComparisonSection.TagList>
					{freelancerBenefits.tags.map((tag) => (
						<ComparisonSection.Tag key={tag}>{tag}</ComparisonSection.Tag>
					))}
				</ComparisonSection.TagList>

				<Button size="lg" variant="brand" className="group">
					{freelancerBenefits.cta}
					<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</Button>
			</ComparisonSection.Content>

			<ComparisonSection.Media>
				<IllustrationPlaceholder label="HelperProfileIllustration (app-side)" />
			</ComparisonSection.Media>
		</ComparisonSection.Root>
	),
};
