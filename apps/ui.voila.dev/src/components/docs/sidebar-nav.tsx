import manifest from "virtual:docs-manifest";
import { CaretRightIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { Collapsible } from "@voila.dev/ui/collapsible";
import { cn } from "@voila.dev/ui/utils";
import type {
	DocsManifestItem,
	DocsManifestSection,
} from "@/lib/docs-manifest.types";
import { useSidebarOpenState } from "./use-sidebar-open-state";

function NavLink({
	item,
	activeSlug,
}: {
	item: DocsManifestItem;
	activeSlug: string;
}) {
	return (
		<li>
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
	);
}

function SectionGroup({
	section,
	activeSlug,
}: {
	section: DocsManifestSection;
	activeSlug: string;
}) {
	const hasActive = section.items.some((item) => item.slug === activeSlug);
	const [defaultOpen, remember] = useSidebarOpenState(
		section.dir,
		hasActive || !section.collapsed,
	);

	return (
		<Collapsible.Root defaultOpen={defaultOpen} onOpenChange={remember}>
			<Collapsible.Trigger className="group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[0.8125rem] font-semibold text-foreground hover:bg-accent">
				<span className="truncate font-mono">{section.label}</span>
				<CaretRightIcon
					className="size-3 shrink-0 text-muted-foreground transition-transform group-data-[panel-open]:rotate-90"
					aria-hidden
				/>
			</Collapsible.Trigger>
			<Collapsible.Content>
				<div className="mt-1 mb-3 border-l border-border pl-2">
					{section.intro.length > 0 && (
						<ul className="space-y-px">
							{section.intro.map((item) => (
								<NavLink key={item.slug} item={item} activeSlug={activeSlug} />
							))}
						</ul>
					)}
					{section.groups.length > 0 ? (
						section.groups.map((group) => (
							<div key={group.id} className="mt-3 first:mt-2">
								<p className="px-2 py-1 text-[0.6875rem] font-medium tracking-wide text-muted-foreground uppercase">
									{group.label}
								</p>
								<ul className="space-y-px">
									{group.items.map((item) => (
										<NavLink
											key={item.slug}
											item={item}
											activeSlug={activeSlug}
										/>
									))}
								</ul>
							</div>
						))
					) : (
						<ul className="space-y-px">
							{section.items.map((item) => (
								<NavLink key={item.slug} item={item} activeSlug={activeSlug} />
							))}
						</ul>
					)}
				</div>
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
