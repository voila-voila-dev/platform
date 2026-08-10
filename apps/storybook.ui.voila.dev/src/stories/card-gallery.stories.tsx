import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { CardGallery } from "@voila.dev/ui/card-gallery";

interface Organization {
	name: string;
	category: string;
	logo?: string;
}

function organizationLogo(initials: string, background: string) {
	return `data:image/svg+xml;utf8,${encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="20" fill="${background}"/><text x="48" y="61" font-family="system-ui, sans-serif" font-size="34" font-weight="600" fill="#fff" text-anchor="middle">${initials}</text></svg>`,
	)}`;
}

const organizations: Organization[] = [
	{
		name: "Riverside Studio",
		category: "Design studio",
		logo: organizationLogo("RS", "#0e7490"),
	},
	{
		name: "Northgate Labs",
		category: "Research",
		logo: organizationLogo("NL", "#7c3aed"),
	},
	{
		name: "Harbour Media",
		category: "Media production",
		logo: organizationLogo("HM", "#ea580c"),
	},
	{
		name: "Eastfield Group",
		category: "Consulting",
		logo: organizationLogo("EG", "#16a34a"),
	},
	{
		name: "Southbank Digital",
		category: "Software",
		logo: organizationLogo("SD", "#2563eb"),
	},
	{ name: "Old Town Press", category: "Publishing" },
];

const meta = {
	title: "UI/CardGallery",
	component: CardGallery.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof CardGallery.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<CardGallery.Root>
			{organizations.map((organization) => (
				<CardGallery.Item key={organization.name}>
					<CardGallery.Logo src={organization.logo}>
						{organization.name.charAt(0)}
					</CardGallery.Logo>
					<CardGallery.Title>{organization.name}</CardGallery.Title>
					<CardGallery.Description>
						{organization.category}
					</CardGallery.Description>
				</CardGallery.Item>
			))}
		</CardGallery.Root>
	),
};

/** `render` turns a tile into a link (or button) without wrapper elements —
 * hover and focus affordances follow the tag automatically. */
export const AsLinks: Story = {
	render: () => (
		<CardGallery.Root itemMinWidth="10rem">
			{organizations.map((organization) => (
				<CardGallery.Item
					key={organization.name}
					render={
						<a href={`#${organization.name}`}>
							<CardGallery.Logo src={organization.logo}>
								{organization.name.charAt(0)}
							</CardGallery.Logo>
							<CardGallery.Title>{organization.name}</CardGallery.Title>
							<CardGallery.Description>
								{organization.category}
							</CardGallery.Description>
						</a>
					}
				/>
			))}
		</CardGallery.Root>
	),
};

/** `itemMinWidth` is the one layout knob: how narrow a tile may get before
 * the grid drops a column. Everything else adapts to the container. */
export const WiderTiles: Story = {
	render: () => (
		<CardGallery.Root itemMinWidth="14rem">
			{organizations.slice(0, 4).map((organization) => (
				<CardGallery.Item key={organization.name}>
					<CardGallery.Logo src={organization.logo}>
						{organization.name.charAt(0)}
					</CardGallery.Logo>
					<CardGallery.Title>{organization.name}</CardGallery.Title>
					<CardGallery.Description>
						{organization.category}
					</CardGallery.Description>
				</CardGallery.Item>
			))}
		</CardGallery.Root>
	),
};
