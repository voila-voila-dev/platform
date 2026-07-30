import { Heading as HeadingComponent } from "@voila.dev/ui/landing";

export function Heading() {
	return (
		<div className="space-y-4">
			<HeadingComponent level="h1">
				Find a <span className="text-brand">trusted freelancer</span> for your{" "}
				<span className="text-highlight">next project</span>
			</HeadingComponent>
			<HeadingComponent level="h3">Two journeys, one match</HeadingComponent>
		</div>
	);
}
