import { Link } from "@tanstack/react-router";
import { Button } from "@voila.dev/ui/components/button";
import { SiteHeader } from "@/components/docs/site-header";

export function NotFound() {
	return (
		<div className="min-h-svh bg-background text-foreground">
			<SiteHeader />
			<main className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
				<p className="font-mono text-sm text-muted-foreground">404</p>
				<h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
					Not found
				</h1>
				<p className="mt-4 text-muted-foreground">
					That page does not exist — it may have been renamed while the API was
					still settling.
				</p>
				{/* Docs slugs resolve through the catch-all route, so the widened
				    string form is the honest type here. */}
				<Button
					className="mt-8"
					nativeButton={false}
					render={<Link to={"/start/introduction" as string} />}
				>
					Start from the introduction
				</Button>
			</main>
		</div>
	);
}
