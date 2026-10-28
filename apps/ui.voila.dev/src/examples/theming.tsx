import { Badge } from "@voila.dev/ui/badge";
import { Button } from "@voila.dev/ui/button";

export function BadgeColors() {
	return (
		<>
			<Badge color="sky">Cardio</Badge>
			<Badge color="emerald">Mobility</Badge>
			<Badge color="amber">Strength</Badge>
			<Badge color="violet">Recovery</Badge>
		</>
	);
}

export function TokenSurface() {
	return (
		<>
			<Button>Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="destructive">Destructive</Button>
		</>
	);
}
