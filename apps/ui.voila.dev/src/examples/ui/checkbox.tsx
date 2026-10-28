import { Checkbox } from "@voila.dev/ui/checkbox";
import { Label } from "@voila.dev/ui/label";

export function Default() {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-start gap-3">
				<Checkbox id="project-terms" />
				<div className="grid gap-1 text-sm">
					<Label htmlFor="project-terms">Accept project terms</Label>
					<p className="text-muted-foreground">
						You confirm your availability for the full duration.
					</p>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<Checkbox id="project-notifications" defaultChecked />
				<Label htmlFor="project-notifications">Notify me about projects</Label>
			</div>
			<div className="flex items-center gap-3">
				<Checkbox id="project-partial" indeterminate />
				<Label htmlFor="project-partial">Some skills selected</Label>
			</div>
		</div>
	);
}
