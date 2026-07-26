import manifest from "virtual:docs-manifest";
import { CaretRightIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { Collapsible } from "@voila.dev/ui/collapsible";
import { cn } from "@voila.dev/ui/utils";
import type { DocsManifestSection } from "@/lib/docs-manifest.types";

function SectionGroup({
	section,
	activeSlug,
}: {
	section: DocsManifestSection;
	activeSlug: string;
}) {
	const isActive = section.items.some((item) => item.slug === activeSlug);
	return (
		<Collapsible.Root defaultOpen={isActive || !section.collapsed}>
			<Collapsible.Trigger className="group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[0.8125rem] font-semibold text-foreground hover:bg-accent">
				<span className="truncate font-mono">{section.label}</span>
				<CaretRightIcon
					className="size-3 shrink-0 text-muted-foreground transition-transform group-data-[panel-open]:rotate-90"
					aria-hidden
				/>
			</Collapsible.Trigger>
			<Collapsible.Content>
				<ul className="mt-1 mb-3 space-y-px border-l border-border pl-2">
					{section.items.map((item) => (
						<li key={item.slug}>
							<Link
								to={item.slug}
								className={cn(
									"block rounded-md px-2 py-1 text-[0.8125rem] leading-snug transition-colors",
									item.slug === activeSlug
										? "bg-primary/10 font-medium text-primary dark:bg-primary/20 dark:text-primary-foreground"
										: "text-muted-foreground hover:bg-accent hover:text-foreground",
								)}
							>
								{item.title}
							</Link>
						</li>
					))}
				</ul>
			</Collapsible.Content>
		</Collapsible.Root>
	);
}

export function SidebarNav({ activeSlug }: { activeSlug: string }) {
	return (
		<nav aria-label="Documentation" className="space-y-1">
			{manifest.sections.map((section) => (
				<SectionGroup
					key={section.dir}
					section={section}
					activeSlug={activeSlug}
				/>
			))}
		</nav>
	);
}
