import { Button } from "@voila.dev/ui/button";
import { Card } from "@voila.dev/ui/card";
import { Section } from "@voila.dev/ui/section";

export function SectionExample() {
	return (
		<Section.Root className="w-full">
			<Section.Header>
				<Section.Heading>
					<Section.Title>Upcoming projects</Section.Title>
					<Section.Description>
						Your workspace's projects this week.
					</Section.Description>
				</Section.Heading>
				<Section.Actions>
					<Button variant="ghost" size="sm">
						View all
					</Button>
				</Section.Actions>
			</Section.Header>
			<Card.Root>
				<Card.Content>Design review — Saturday, June 14, 3:00 pm</Card.Content>
			</Card.Root>
		</Section.Root>
	);
}
