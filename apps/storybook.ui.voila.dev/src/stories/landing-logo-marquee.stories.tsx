import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { LogoMarquee } from "@voila.dev/ui-landing/components/logo-marquee";
import { partnerLogoDataUri, partnerNames } from "./landing-fixtures";

const meta = {
	title: "Landing/LogoMarquee",
	component: LogoMarquee.Root,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof LogoMarquee.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Reproduces the original Astro site's `section-clients-bar.astro`. */
export const Marquee: Story = {
	render: () => (
		<LogoMarquee.Root>
			<LogoMarquee.Title>Ils nous font confiance</LogoMarquee.Title>
			<LogoMarquee.Viewport>
				<LogoMarquee.Track>
					{partnerNames.map((name) => (
						<LogoMarquee.Item
							key={name}
							src={partnerLogoDataUri(name)}
							alt={name}
						/>
					))}
				</LogoMarquee.Track>
			</LogoMarquee.Viewport>
		</LogoMarquee.Root>
	),
};

/** Reproduces the static brand row of `section-equipment-brands.astro`. */
export const StaticRow: Story = {
	render: () => (
		<LogoMarquee.Root>
			<LogoMarquee.Title>Des marques de référence</LogoMarquee.Title>
			<LogoMarquee.StaticTrack>
				{partnerNames.slice(0, 4).map((name) => (
					<LogoMarquee.Item
						key={name}
						src={partnerLogoDataUri(name)}
						alt={name}
					/>
				))}
			</LogoMarquee.StaticTrack>
		</LogoMarquee.Root>
	),
};

export const FastLoop: Story = {
	render: () => (
		<LogoMarquee.Root>
			<LogoMarquee.Viewport>
				<LogoMarquee.Track duration={10}>
					{partnerNames.map((name) => (
						<LogoMarquee.Item
							key={name}
							src={partnerLogoDataUri(name)}
							alt={name}
						/>
					))}
				</LogoMarquee.Track>
			</LogoMarquee.Viewport>
		</LogoMarquee.Root>
	),
};
