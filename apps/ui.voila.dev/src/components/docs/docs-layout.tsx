import manifest from "virtual:docs-manifest";
import { MDXProvider } from "@mdx-js/react";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import { Breadcrumb } from "@voila.dev/ui/breadcrumb";
import type { ReactNode } from "react";
import { mdxComponents } from "@/components/docs/mdx-components";
import { PrevNext } from "@/components/docs/prev-next";
import { SidebarNav } from "@/components/docs/sidebar-nav";
import { SiteHeader } from "@/components/docs/site-header";
import { Toc } from "@/components/docs/toc";
import type { TocEntry } from "@/lib/remark-toc-export";

interface DocsLayoutProps {
	slug: string;
	frontmatter: { title: string; description: string };
	toc: TocEntry[];
	children: ReactNode;
}

export function DocsLayout({
	slug,
	frontmatter,
	toc,
	children,
}: DocsLayoutProps) {
	const section = manifest.sections.find((s) =>
		s.items.some((item) => item.slug === slug),
	);
	const editUrl = `https://github.com/voila-voila-dev/ui/edit/main/apps/ui.voila.dev/src/content/docs${slug}.mdx`;

	return (
		<div className="min-h-svh bg-background text-foreground">
			<SiteHeader activeSlug={slug} />
			<div className="mx-auto flex max-w-screen-2xl px-4 sm:px-6">
				<aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-64 shrink-0 overflow-y-auto py-6 pr-4 no-scrollbar lg:block">
					<SidebarNav activeSlug={slug} />
				</aside>
				<main className="min-w-0 flex-1 px-0 py-8 lg:px-10">
					<div className="mx-auto max-w-3xl">
						{section && (
							<Breadcrumb.Root className="mb-3">
								<Breadcrumb.List>
									<Breadcrumb.Item>
										<span className="font-mono text-xs">{section.label}</span>
									</Breadcrumb.Item>
									<Breadcrumb.Separator />
									<Breadcrumb.Item>
										<Breadcrumb.Page>{frontmatter.title}</Breadcrumb.Page>
									</Breadcrumb.Item>
								</Breadcrumb.List>
							</Breadcrumb.Root>
						)}
						<h1 className="font-heading text-3xl font-bold tracking-tight">
							{frontmatter.title}
						</h1>
						{frontmatter.description && (
							<p className="mt-2 text-lg text-muted-foreground">
								{frontmatter.description}
							</p>
						)}
						<article className="docs-prose mt-8">
							<MDXProvider components={mdxComponents}>{children}</MDXProvider>
						</article>
						<div className="mt-10 flex justify-end">
							<a
								href={editUrl}
								className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								<PencilSimpleIcon aria-hidden />
								Edit this page on GitHub
							</a>
						</div>
						<PrevNext slug={slug} />
					</div>
				</main>
				<aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-56 shrink-0 overflow-y-auto py-8 pl-2 no-scrollbar xl:block">
					<Toc toc={toc} />
				</aside>
			</div>
		</div>
	);
}
