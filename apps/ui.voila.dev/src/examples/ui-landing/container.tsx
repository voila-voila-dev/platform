import { Container } from "@voila.dev/ui/landing";

export function ContainerExample() {
	return (
		<Container size="md">
			<div className="rounded-lg border border-border border-dashed bg-muted/40 p-6 text-muted-foreground text-sm">
				max-width md
			</div>
		</Container>
	);
}
