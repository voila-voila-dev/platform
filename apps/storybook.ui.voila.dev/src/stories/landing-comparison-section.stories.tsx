import {
	ArrowRightIcon,
	BuildingsIcon,
	StethoscopeIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import { ComparisonSection } from "@voila.dev/ui-landing/components/comparison-section";
import { Eyebrow } from "@voila.dev/ui-landing/components/eyebrow";
import { Heading } from "@voila.dev/ui-landing/components/heading";
import { Text } from "@voila.dev/ui-landing/components/text";
import {
	helperBenefits,
	IllustrationPlaceholder,
	organizationBenefits,
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

/** Reproduces the original Astro site's `section-organization-benefits.astro`. */
export const OrganizationBenefits: Story = {
	render: () => (
		<ComparisonSection.Root tone="organization" background="muted">
			<ComparisonSection.Content>
				<Eyebrow.Root tone="organization" className="mb-4">
					<Eyebrow.Icon>
						<BuildingsIcon />
					</Eyebrow.Icon>
					<Eyebrow.Label>{organizationBenefits.badge}</Eyebrow.Label>
				</Eyebrow.Root>

				<Heading className="mb-8">
					{organizationBenefits.titleStart}{" "}
					<span className="text-organization">
						{organizationBenefits.titleHighlight}
					</span>
				</Heading>

				<ComparisonSection.Panels>
					<ComparisonSection.Panel variant="without">
						<ComparisonSection.PanelTitle>
							{organizationBenefits.withoutTitle}
						</ComparisonSection.PanelTitle>
						<ComparisonSection.PanelList>
							{organizationBenefits.withoutItems.map((item, index) => (
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
							{organizationBenefits.withTitle}
						</ComparisonSection.PanelTitle>
						<ComparisonSection.PanelList>
							{organizationBenefits.withItems.map((item, index) => (
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
					{organizationBenefits.tags.map((tag) => (
						<ComparisonSection.Tag key={tag}>{tag}</ComparisonSection.Tag>
					))}
				</ComparisonSection.TagList>

				<Button
					size="lg"
					variant="organization"
					className="group h-auto min-h-11 max-w-full whitespace-normal py-2 text-center"
				>
					{organizationBenefits.cta}
					<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</Button>
			</ComparisonSection.Content>

			<ComparisonSection.Media>
				<IllustrationPlaceholder label="OrganizationDashboardIllustration (app-side)" />
			</ComparisonSection.Media>
		</ComparisonSection.Root>
	),
};

/** Reproduces the original Astro site's `section-helper-benefits.astro`. */
export const HelperBenefits: Story = {
	render: () => (
		<ComparisonSection.Root tone="provider">
			<ComparisonSection.Content>
				<Eyebrow.Root tone="provider" className="mb-4">
					<Eyebrow.Icon>
						<StethoscopeIcon />
					</Eyebrow.Icon>
					<Eyebrow.Label>{helperBenefits.badge}</Eyebrow.Label>
				</Eyebrow.Root>

				<Heading className="mb-4">
					{helperBenefits.titleStart}{" "}
					<span className="text-provider lg:block">
						{helperBenefits.titleHighlight}
					</span>
				</Heading>

				<Text variant="lead" className="mb-8">
					{helperBenefits.lead}
				</Text>

				<ComparisonSection.Panels>
					<ComparisonSection.Panel variant="without">
						<ComparisonSection.PanelTitle>
							{helperBenefits.withoutTitle}
						</ComparisonSection.PanelTitle>
						<ComparisonSection.PanelList>
							{helperBenefits.withoutItems.map((item) => (
								<ComparisonSection.PanelItem key={item}>
									{item}
								</ComparisonSection.PanelItem>
							))}
						</ComparisonSection.PanelList>
					</ComparisonSection.Panel>

					<ComparisonSection.Panel variant="with">
						<ComparisonSection.PanelTitle>
							{helperBenefits.withTitle}
						</ComparisonSection.PanelTitle>
						<ComparisonSection.PanelList>
							{helperBenefits.withItems.map((item) => (
								<ComparisonSection.PanelItem key={item}>
									{item}
								</ComparisonSection.PanelItem>
							))}
						</ComparisonSection.PanelList>
					</ComparisonSection.Panel>
				</ComparisonSection.Panels>

				<ComparisonSection.TagList>
					{helperBenefits.tags.map((tag) => (
						<ComparisonSection.Tag key={tag}>{tag}</ComparisonSection.Tag>
					))}
				</ComparisonSection.TagList>

				<Button size="lg" variant="provider" className="group">
					{helperBenefits.cta}
					<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</Button>
			</ComparisonSection.Content>

			<ComparisonSection.Media>
				<IllustrationPlaceholder label="HelperProfileIllustration (app-side)" />
			</ComparisonSection.Media>
		</ComparisonSection.Root>
	),
};
