import { cn } from "#/lib/utils.ts";
import { Spinner } from "#/spinner/components/spinner.tsx";

interface Props {
	loading: boolean;
	className?: string;
}

/** Dims the rows under a spinner while a refetch is in flight. */
export function DataTableLoadingOverlay({ loading, className }: Props) {
	if (!loading) {
		return null;
	}
	return (
		<div
			className={cn(
				"absolute inset-0 z-20 flex items-center justify-center bg-background/50",
				className,
			)}
		>
			<Spinner className="size-5 text-muted-foreground" />
		</div>
	);
}
