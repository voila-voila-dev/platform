import {
	Container,
	Section as SectionComponent,
	sectionBackgroundOptions,
	Text as TextComponent,
} from "@voila.dev/ui/landing";

export function Default() {
	return (
		<div className="w-full">
			{sectionBackgroundOptions.map((background) => (
				<SectionComponent key={background} spacing="sm" background={background}>
					<Container>
						<TextComponent weight="medium">{background}</TextComponent>
					</Container>
				</SectionComponent>
			))}
		</div>
	);
}
