import {
	Container,
	FeatureGrid,
	Section as SectionComponent,
	SectionIntro as SectionIntroParts,
} from "@voila.dev/ui/landing";
import { values } from "./fixtures";

/**
 * The quick-start's 3-minute win: a complete section, composed from the
 * layout primitives and one content grid.
 */
export function QuickStartWin() {
	return (
		<SectionComponent spacing="sm" background="muted">
			<Container size="md">
				<SectionIntroParts.Root>
					<SectionIntroParts.Title>
						Why choose <span className="text-primary">Acme</span>?
					</SectionIntroParts.Title>
					<SectionIntroParts.Description>
						Two reasons are enough to get started.
					</SectionIntroParts.Description>
				</SectionIntroParts.Root>
				<FeatureGrid.Root tone="primary" columns="2" className="mt-10">
					{values.map((value) => {
						const Icon = value.icon;
						return (
							<FeatureGrid.Card key={value.title}>
								<FeatureGrid.CardIcon>
									<Icon />
								</FeatureGrid.CardIcon>
								<FeatureGrid.CardTitle>{value.title}</FeatureGrid.CardTitle>
								<FeatureGrid.CardDescription>
									{value.description}
								</FeatureGrid.CardDescription>
							</FeatureGrid.Card>
						);
					})}
				</FeatureGrid.Root>
			</Container>
		</SectionComponent>
	);
}
