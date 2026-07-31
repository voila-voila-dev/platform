import { Input } from "@voila.dev/ui/input";
import { Label } from "@voila.dev/ui/label";

export function Default() {
	return (
		<div className="grid w-full max-w-72 gap-2">
			<Label htmlFor="workspace-email">Workspace email</Label>
			<Input id="workspace-email" type="email" placeholder="team@example.com" />
		</div>
	);
}
