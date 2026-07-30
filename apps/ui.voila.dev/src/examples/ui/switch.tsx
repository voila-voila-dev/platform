import { Label } from "@voila.dev/ui/label";
import { Switch } from "@voila.dev/ui/switch";

export function SwitchExample() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2">
				<Switch id="notify-projects" defaultChecked />
				<Label htmlFor="notify-projects">Notify me about new projects</Label>
			</div>
			<div className="flex items-center gap-4">
				<Switch size="sm" defaultChecked />
				<Switch defaultChecked />
				<Switch disabled />
			</div>
		</div>
	);
}
