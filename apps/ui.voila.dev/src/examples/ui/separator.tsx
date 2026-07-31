import { Separator } from "@voila.dev/ui/separator";

export function Default() {
	return (
		<div className="w-full max-w-72">
			<div className="space-y-1">
				<h4 className="font-medium text-sm">Project details</h4>
				<p className="text-muted-foreground text-sm">
					Landing page redesign for Northwind Trading.
				</p>
			</div>
			<Separator className="my-4" />
			<div className="flex h-5 items-center gap-4 text-sm">
				<span>Projects</span>
				<Separator orientation="vertical" />
				<span>Freelancers</span>
				<Separator orientation="vertical" />
				<span>Billing</span>
			</div>
			<Separator className="my-4">OR</Separator>
		</div>
	);
}
