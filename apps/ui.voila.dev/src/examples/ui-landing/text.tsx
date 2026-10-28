import { Text as TextComponent } from "@voila.dev/ui/landing";

export function Text() {
	return (
		<div className="space-y-4">
			<TextComponent variant="lead">
				The platform that connects client teams with independent freelancers.
			</TextComponent>
			<TextComponent variant="muted">
				Let's build better projects, together.
			</TextComponent>
		</div>
	);
}
