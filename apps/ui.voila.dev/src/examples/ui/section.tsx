import { Button } from "@voila.dev/ui/button";
import { Card } from "@voila.dev/ui/card";
import { Section } from "@voila.dev/ui/section";

export function Default() {
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

export function Nested() {
	return (
		<Section.Root className="w-full">
			<Section.Header>
				<Section.Heading>
					<Section.Title>Workspace settings</Section.Title>
				</Section.Heading>
			</Section.Header>
			<Section.Root>
				<Section.Header>
					<Section.Heading>
						{/* biome-ignore lint/a11y/useHeadingContent: Base UI's render prop nests the Section.Title children inside the heading. */}
						<Section.Title render={<h3 />}>Billing</Section.Title>
						<Section.Description>
							Invoices are issued on the first of the month.
						</Section.Description>
					</Section.Heading>
				</Section.Header>
				<Card.Root>
					<Card.Content>Pro — $49 per seat</Card.Content>
				</Card.Root>
			</Section.Root>
		</Section.Root>
	);
}
