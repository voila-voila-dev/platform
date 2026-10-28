import { Card } from "@voila.dev/ui/card";
import { Skeleton } from "@voila.dev/ui/skeleton";

export function SkeletonDefault() {
	return (
		<div className="flex items-center gap-4">
			<Skeleton className="size-10 rounded-full" />
			<div className="space-y-2">
				<Skeleton className="h-4 w-40" />
				<Skeleton className="h-4 w-28" />
			</div>
		</div>
	);
}

export function SkeletonCard() {
	return (
		<div role="status" className="w-72">
			<span className="sr-only">Loading project…</span>
			<Card.Root aria-hidden>
				<Card.Header>
					<Skeleton className="h-5 w-44" />
				</Card.Header>
				<Card.Content className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
				</Card.Content>
				<Card.Footer className="gap-2">
					<Skeleton className="h-8 w-24" />
					<Skeleton className="h-8 w-24" />
				</Card.Footer>
			</Card.Root>
		</div>
	);
}
