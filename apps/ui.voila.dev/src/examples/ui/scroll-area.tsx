import { ScrollArea } from "@voila.dev/ui/scroll-area";

export function ScrollAreaExample() {
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

/* -------------------------------------------------------------------------- */
/* Media                                                                      */
/* -------------------------------------------------------------------------- */
