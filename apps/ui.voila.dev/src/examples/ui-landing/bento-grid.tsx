import { HandHeartIcon } from "@phosphor-icons/react";
import { BentoGrid } from "@voila.dev/ui/landing";
import { values } from "./fixtures";

export function Default() {
	return (
		<BentoGrid.Root>
			<BentoGrid.FeaturedItem>
				<BentoGrid.FeaturedContent>
					<BentoGrid.FeaturedIcon>
						<HandHeartIcon />
					</BentoGrid.FeaturedIcon>
					<BentoGrid.FeaturedLabel>Our mantra</BentoGrid.FeaturedLabel>
					<BentoGrid.FeaturedTitle>CRAFT</BentoGrid.FeaturedTitle>
				</BentoGrid.FeaturedContent>
				<BentoGrid.FeaturedDescription>
					Taking care of everyone who ships great work, at every step.
				</BentoGrid.FeaturedDescription>
			</BentoGrid.FeaturedItem>
			{values.map((value, index) => {
				const Icon = value.icon;
				return (
					<BentoGrid.Item key={value.title} wide={index === values.length - 1}>
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
	);
}
