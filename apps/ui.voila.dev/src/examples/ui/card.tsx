import { Badge } from "@voila.dev/ui/badge";
import { Button } from "@voila.dev/ui/button";
import { Card } from "@voila.dev/ui/card";

export function Default() {
	return (
		<Card.Root className="w-full max-w-96">
			<Card.Header>
				<Card.Title>Product designer — Launch week</Card.Title>
				<Card.Description>Northgate Labs · Saturday, June 20</Card.Description>
				<Card.Action>
					<Badge>Open</Badge>
				</Card.Action>
			</Card.Header>
			<Card.Content>
				<p>
					End-to-end design support for the launch sprint, including asset
					production and final design QA.
				</p>
			</Card.Content>
			<Card.Footer className="justify-end gap-2">
				<Button variant="outline" size="sm">
					View details
				</Button>
				<Button size="sm">Apply</Button>
			</Card.Footer>
		</Card.Root>
	);
}
