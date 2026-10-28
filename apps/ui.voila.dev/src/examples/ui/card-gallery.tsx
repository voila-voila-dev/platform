import { CardGallery } from "@voila.dev/ui/card-gallery";

interface Organization {
	name: string;
	category: string;
	logo?: string;
}

function logo(initials: string, background: string) {
	return `data:image/svg+xml;utf8,${encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="20" fill="${background}"/><text x="48" y="61" font-family="system-ui, sans-serif" font-size="34" font-weight="600" fill="#fff" text-anchor="middle">${initials}</text></svg>`,
	)}`;
}

const ORGANIZATIONS: Organization[] = [
	{
		name: "Riverside Studio",
		category: "Design studio",
		logo: logo("RS", "#0e7490"),
	},
	{
		name: "Northgate Labs",
		category: "Research",
		logo: logo("NL", "#7c3aed"),
	},
	{
		name: "Harbour Media",
		category: "Media production",
		logo: logo("HM", "#ea580c"),
	},
	{ name: "Old Town Press", category: "Publishing" },
	{
		name: "Southbank Digital",
		category: "Software",
		logo: logo("SD", "#2563eb"),
	},
	{
		name: "Eastfield Group",
		category: "Consulting",
		logo: logo("EG", "#16a34a"),
	},
];

export function Default() {
	return (
		<CardGallery.Root className="w-full">
			{ORGANIZATIONS.map((organization) => (
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
	);
}

export function AsLinks() {
	return (
		<CardGallery.Root className="w-full" itemMinWidth="10rem">
			{ORGANIZATIONS.slice(0, 4).map((organization) => (
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
	);
}
