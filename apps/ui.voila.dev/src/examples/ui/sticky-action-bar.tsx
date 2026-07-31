import { Button } from "@voila.dev/ui/button";
import { StickyActionBar } from "@voila.dev/ui/sticky-action-bar";

export function Default() {
	return (
		<div className="relative h-80 w-full max-w-md overflow-y-auto rounded-lg border">
			<div className="flex flex-col gap-3 p-4 pb-2">
				{Array.from({ length: 12 }, (_, index) => (
					<p key={String(index)} className="text-muted-foreground text-sm">
						Project detail {index + 1} — landing page redesign for the launch,
						first drafts due 48 hours after the kickoff call.
					</p>
				))}
			</div>
			<StickyActionBar hideOnDesktop={false}>
				<Button variant="outline">Contact</Button>
				<Button>Apply</Button>
			</StickyActionBar>
		</div>
	);
}
