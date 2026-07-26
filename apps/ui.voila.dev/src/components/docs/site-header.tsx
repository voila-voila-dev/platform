import { GithubLogoIcon, ListIcon } from "@phosphor-icons/react";
import { useRouterState } from "@tanstack/react-router";
import { Button } from "@voila.dev/ui/button";
import { Sheet } from "@voila.dev/ui/sheet";
import { useEffect, useState } from "react";
import { PaletteSelect } from "@/components/docs/palette-select";
import { SearchCommand } from "@/components/docs/search-command";
import { SidebarNav } from "@/components/docs/sidebar-nav";
import { ThemeToggle } from "@/components/docs/theme-toggle";
import { Wordmark } from "@/components/docs/wordmark";

export function SiteHeader({ activeSlug }: { activeSlug?: string }) {
	const [menuOpen, setMenuOpen] = useState(false);
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	// Navigating from the drawer should close it.
	useEffect(() => {
		setMenuOpen(false);
	}, [pathname]);

	return (
		<header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
			<div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-4 px-4 sm:px-6">
				{activeSlug !== undefined && (
					<Sheet.Root open={menuOpen} onOpenChange={setMenuOpen}>
						<Sheet.Trigger
							render={
								<Button
									variant="ghost"
									size="icon-sm"
									aria-label="Open navigation"
									className="lg:hidden"
								/>
							}
						>
							<ListIcon />
						</Sheet.Trigger>
						<Sheet.Content side="left" className="w-72 overflow-y-auto p-4">
							<Sheet.Header className="sr-only">
								<Sheet.Title>Navigation</Sheet.Title>
								<Sheet.Description>Documentation pages</Sheet.Description>
							</Sheet.Header>
							<SidebarNav activeSlug={activeSlug} />
						</Sheet.Content>
					</Sheet.Root>
				)}
				<Wordmark />
				<div className="ml-auto flex items-center gap-2">
					<div className="hidden sm:block">
						<SearchCommand />
					</div>
					<Button
						variant="ghost"
						size="sm"
						className="hidden md:inline-flex"
						nativeButton={false}
						render={
							// biome-ignore lint/a11y/useAnchorContent: Button injects the label as children.
							<a href="https://storybook.ui.voila.dev" />
						}
					>
						Storybook
					</Button>
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label="GitHub repository"
						nativeButton={false}
						render={
							// biome-ignore lint/a11y/useAnchorContent: Button injects the icon as children.
							<a href="https://github.com/voila-voila-dev/ui" />
						}
					>
						<GithubLogoIcon />
					</Button>
					<PaletteSelect />
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
