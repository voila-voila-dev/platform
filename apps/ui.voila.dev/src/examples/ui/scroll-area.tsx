import { ScrollArea } from "@voila.dev/ui/scroll-area";

export function Horizontal() {
	return (
		<ScrollArea.Root className="w-full max-w-80 rounded-lg border">
			<div className="flex w-max gap-3 p-3">
				{Array.from({ length: 10 }, (_, index) => (
					<div
						key={`freelancer-${index + 1}`}
						className="flex size-24 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground text-sm"
					>
						#{index + 1}
					</div>
				))}
			</div>
			<ScrollArea.Bar orientation="horizontal" />
		</ScrollArea.Root>
	);
}

export function Default() {
	return (
		<ScrollArea.Root className="h-56 w-full max-w-72 rounded-lg border">
			<div className="p-3">
				<p className="mb-2 font-medium text-sm">Upcoming projects</p>
				{Array.from({ length: 20 }, (_, index) => (
					<div
						key={`project-${index + 1}`}
						className="border-b py-2 text-sm last:border-b-0"
					>
						Project #{index + 1} — Landing page sprint
					</div>
				))}
			</div>
		</ScrollArea.Root>
	);
}
