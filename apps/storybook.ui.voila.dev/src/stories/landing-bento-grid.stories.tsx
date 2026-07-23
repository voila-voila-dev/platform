import {
	HandHeartIcon,
	LightningIcon,
	PathIcon,
	ShieldCheckIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { BentoGrid } from "@voila.dev/ui-landing/components/bento-grid";
import { values } from "./landing-fixtures";

const meta = {
	title: "Landing/BentoGrid",
	component: BentoGrid.Root,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
} satisfies Meta<typeof BentoGrid.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

const valueIcons = [LightningIcon, PathIcon, ShieldCheckIcon];

/** Reproduces the "CARE" values bento of the original Astro site's `section-values.astro`. */
export const Values: Story = {
	render: () => (
		<BentoGrid.Root>
			<BentoGrid.FeaturedItem>
				<BentoGrid.FeaturedContent>
					<BentoGrid.FeaturedIcon>
						<HandHeartIcon />
					</BentoGrid.FeaturedIcon>
					<BentoGrid.FeaturedLabel>Notre mantra</BentoGrid.FeaturedLabel>
					<BentoGrid.FeaturedTitle>CARE</BentoGrid.FeaturedTitle>
				</BentoGrid.FeaturedContent>
				<BentoGrid.FeaturedDescription>
					Parce que les enjeux de santé doivent être une source de progrès.
					Prendre soin de l'ensemble des acteurs du sport, à chaque étape du
					parcours ACME, est notre priorité.
				</BentoGrid.FeaturedDescription>
			</BentoGrid.FeaturedItem>

			{values.map((value, index) => {
				const Icon = valueIcons[index] ?? LightningIcon;
				const isLast = index === values.length - 1;
				return (
					<BentoGrid.Item
						key={value.title}
						wide={isLast}
						style={{ animationDelay: `${(index + 1) * 0.1}s` }}
					>
						<BentoGrid.ItemLayout>
							<BentoGrid.ItemIcon>
								<Icon />
							</BentoGrid.ItemIcon>
							<BentoGrid.ItemBody>
								<BentoGrid.ItemTitle>{value.title}</BentoGrid.ItemTitle>
								<BentoGrid.ItemDescription>
									{value.description}
								</BentoGrid.ItemDescription>
							</BentoGrid.ItemBody>
						</BentoGrid.ItemLayout>
					</BentoGrid.Item>
				);
			})}
		</BentoGrid.Root>
	),
};
